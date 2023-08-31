import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Organization } from "../model/organization.entity";
import { DataSource, Like, Repository } from "typeorm";
import { from, map } from "rxjs";
import { SchedulerTaskEntry } from "../model/scheduler-task-entry.entity";
import { UserAssignedToTask } from "../model/user-assigned-task.entity";
import { ISchedulerTaskEntry } from "../model/interfaces/schedulertaskentry.interface";
import * as moments from "moment";
import { IPeriodicTaskStatus } from "../model/interfaces/periodictaskstatus.interface";
import { PeriodicTaskStatus } from "../model/periodic-task-status.entity";
import { CONNECTION } from "src/tenancy/tenancy.symbols";

@Injectable()
export class CronImplService{
    private readonly logger = new Logger(CronImplService.name);

    // private userAssignedToTaskRepository: Repository<UserAssignedToTask>;
    // private periodicTaskStatusRepository: Repository<PeriodicTaskStatus>;
    // private schedulertaskentryRepository: Repository<SchedulerTaskEntry>;
    
    constructor(
        @InjectRepository(Organization)
        private readonly orgRepository: Repository<Organization>,

        // @Inject(CONNECTION) connection: DataSource,
        @InjectRepository(UserAssignedToTask)
        private userAssignedToTaskRepository: Repository<UserAssignedToTask>,
        @InjectRepository(PeriodicTaskStatus)
        private periodicTaskStatusRepository: Repository<PeriodicTaskStatus>,
        @InjectRepository(SchedulerTaskEntry)
        private schedulertaskentryRepository: Repository<SchedulerTaskEntry>
    ) {
        // this.userAssignedToTaskRepository = connection.getRepository(UserAssignedToTask);
        // this.periodicTaskStatusRepository = connection.getRepository(PeriodicTaskStatus);
        // this.schedulertaskentryRepository = connection.getRepository(SchedulerTaskEntry);
    }


    findAll(tenantId: string) {
        return from(
          this.orgRepository.find({
            select: ["id", "name", "nfc_status", "status", "sub_domain"],
            relations: ["country", "state", "city"],
            order: { id: "DESC" },
          })
        ).pipe(
          map((orgs: Organization[]) => {
            //console.log("orgs::",orgs)
            return orgs;
          })
        );
      }

      createScheduledTasks(params: {tenantId: string, org_id: number}) {
        var self = this;
        return from(this.schedulertaskentryRepository.find({
          where: [{ status: 'Pending', type: 'digo', ref_key: Like(params.org_id+"-%") }],
          relations: ["tasktemplate","user"],
          order: {id: "ASC"}
        })).pipe(
          map(async (schedulertaskentry: SchedulerTaskEntry[]) => {
            let periodictaskStatus: IPeriodicTaskStatus[] = [];
            let schedulerTaskentry: ISchedulerTaskEntry[] = [];
            schedulertaskentry.forEach(async function(task){
                let taskstatusObj: IPeriodicTaskStatus = {
                    task_name: task.tasktemplate.task_name,
                    frequency: task.tasktemplate.frequency,
                    location_id: task.tasktemplate.location,
                    area_id: task.tasktemplate.area,
                    unit_id: task.tasktemplate.unit_id,
                    level_id: task.tasktemplate.level_id,
                    start_date: task.start_date,
                    end_date: task.end_date,
                    user_id: task.assignee_id,
                    ref_key: task.ref_key,
                    status: 'ACTIVE',
                    description: task.tasktemplate.description,
                  };
                  periodictaskStatus.push(taskstatusObj);

                  let scheduleObj: ISchedulerTaskEntry = {
                    id: task.id,
                    status: "Completed",
                    task_count: 1,
                  };
                  schedulerTaskentry.push(scheduleObj);
                
            })
              try {
                  await self.periodicTaskStatusRepository.save(periodictaskStatus,{
                                                              chunk: periodictaskStatus.length / 1000,
                                                              });
                  await self.schedulertaskentryRepository.save(schedulerTaskentry,{
                                                              chunk: periodictaskStatus.length / 1000,
                                                              });
              } catch (error) {
                this.logger.debug("Error in Creating tasks " + error?.message);
              }
          })
        )
      }

      enterScheduledTasks(params: {tenantId: string, org_id: number, create_task_before_days: number}) {
        var self = this;
        console.log("org_id:: ",params.org_id);
        return from(this.userAssignedToTaskRepository.find({
          where: [{ active: 'ACTIVE' }],
          relations: ["tasktemplate","user"]
        })).pipe(
            map((userassignedTask: UserAssignedToTask[]) => {
               console.log("org_id:: ",params.org_id);
              let scheduletaskArray: ISchedulerTaskEntry[] = [];
              userassignedTask.forEach(async function(task){
                  if (task.user) {
                    if (task.user.status !== "Deactive") {
                      const currentdate = new Date();
                      const start_date = task.tasktemplate.start_date;
                      const end_date = task.tasktemplate.end_date;
                      if (currentdate >= start_date && currentdate <= end_date) {
                        
                        let scheduletaskObj: ISchedulerTaskEntry = {
                          periodic_task_id: task.tasktemplate.id,
                          assignee_id: task.user.id,
                          ref_key: task.tasktemplate.ref_key,
                          task_count: 0,
                          type: "digo",
                          status: "Pending",
                          scheduler_flag: "false",
                          error: "",
                        };
                        if(task.tasktemplate.frequency == "Daily"){
                          scheduletaskObj = await self.createDailyTasks(scheduletaskObj, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }else if(task.tasktemplate.frequency == "Weekly"){
                          scheduletaskObj = await self.createWeeklyTasks(scheduletaskObj,task, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }else if(task.tasktemplate.frequency == "Bi-Weekly"){
                          scheduletaskObj = await self.createBiWeeklyTasks(scheduletaskObj,task, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }else if(task.tasktemplate.frequency == "Monthly"){
                          scheduletaskObj = await self.createMonthlyTasks(scheduletaskObj,task, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }else if(task.tasktemplate.frequency == "Bi-Monthly"){
                          scheduletaskObj = await self.createBiMonthlyTasks(scheduletaskObj,task, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }else if(task.tasktemplate.frequency == "Quarterly"){
                          scheduletaskObj = await self.createQuarterlyTasks(scheduletaskObj,task, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }else if(task.tasktemplate.frequency == "Yearly"){
                          scheduletaskObj = await self.createYearlyTasks(scheduletaskObj,task, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }else if(task.tasktemplate.frequency == "Bi-Yearly"){
                          scheduletaskObj = await self.createBiYearlyTasks(scheduletaskObj,task, params.create_task_before_days);
                          if(scheduletaskObj.start_date != null){
                            scheduletaskArray.push(scheduletaskObj);
                          }
                        }
                        
                        try {
                          await self.schedulertaskentryRepository.save(scheduletaskArray,{
                                                    chunk: scheduletaskArray.length / 1000,
                                                  });
                        } catch (error) {
                          self.logger.debug("Error in tasks entry " + error?.message);
                        }
                      } else {
                        console.log('⛔️ date is not in the range');
                      }
                    }
                  }
              });
              return ;
            })
        );
      }

      createDailyTasks(taskstatusObj: ISchedulerTaskEntry, create_task_before_days: number) {
        console.log('✅ Adding Daily tasks..... ');
        const currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");
        taskstatusObj.start_date = new Date(currentdate);
        taskstatusObj.end_date = new Date(currentdate);
        return taskstatusObj;
      }

      createWeeklyTasks(taskstatusObj: ISchedulerTaskEntry,userassignedTask: UserAssignedToTask,create_task_before_days: number) {
        console.log('✅ Adding Weekly tasks..... ');
        const currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");
        var day = new Date(currentdate).getDay();
        console.log("day::",day)
        if(day == Number(userassignedTask.tasktemplate.day)){
          taskstatusObj.start_date = new Date(currentdate);
          taskstatusObj.end_date = new Date(currentdate);
        }
        return taskstatusObj;
      }

      createBiWeeklyTasks(taskstatusObj: ISchedulerTaskEntry,userassignedTask: UserAssignedToTask, create_task_before_days: number) {
        console.log('✅ Adding Bi-Weekly tasks..... ');
        const currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");
        var day = new Date(currentdate).getDay();
        console.log("day::",day)
        if(day == Number(userassignedTask.tasktemplate.day)){
          var year = new Date(new Date(currentdate).getFullYear(), 0, 1);
          var days = Math.floor((new Date(currentdate).getTime() - year.getTime()) / (24 * 60 * 60 * 1000));
          var week = Math.ceil(( new Date(currentdate).getDay() + 1 + days) / 7);
		 			let oddEvenWeek = week % 2 == 0 ? "Even" : "Odd";
          console.log("oddEvenWeek::",oddEvenWeek)
          if(oddEvenWeek == userassignedTask.tasktemplate.repeat_type) {
            taskstatusObj.start_date = new Date(currentdate);
            taskstatusObj.end_date = new Date(currentdate);
          }
        }
        return taskstatusObj;
      }

      createMonthlyTasks(taskstatusObj: ISchedulerTaskEntry,userassignedTask: UserAssignedToTask, create_task_before_days: number) {
        console.log('✅ Adding Monthly tasks..... ');
        const currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");
        let date = new Date(currentdate).getDate();
        const forEndDate = new Date();
        forEndDate.setDate(new Date(currentdate).getDate() + userassignedTask.tasktemplate.end_day - userassignedTask.tasktemplate.start_day); 
        
        let month_week_no = userassignedTask.tasktemplate.month_week_no;
        let month_week_day = userassignedTask.tasktemplate.month_week_day;
        var weekOfMonth = Math.ceil(new Date(currentdate).getDate() / 7); 
        console.log("weekOfMonth:: ",weekOfMonth);
        let dayOfWeek = new Date(currentdate).getDay();
        console.log("dayOfWeek:: ",dayOfWeek);

        if(userassignedTask.tasktemplate.start_day != 0 && userassignedTask.tasktemplate.end_day != 0){
          if(date == userassignedTask.tasktemplate.start_day){
            taskstatusObj.start_date = new Date(currentdate);
            taskstatusObj.end_date = forEndDate;
          }
        }else{
          if(weekOfMonth == month_week_no && dayOfWeek == month_week_day){
              taskstatusObj.start_date = new Date(currentdate);
              taskstatusObj.end_date = new Date(currentdate);
          }
        }
        return taskstatusObj;
      }

      createBiMonthlyTasks(taskstatusObj: ISchedulerTaskEntry,userassignedTask: UserAssignedToTask, create_task_before_days: number) {
        console.log('✅ Adding Bi-Monthly tasks..... ');
        const currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");
        let date = currentdate;

        let month = new Date(currentdate).getMonth()+1;
        let dateOfMonth="";
        if(month % 2 == 0){
          dateOfMonth="even";
        }else{
          dateOfMonth="odd";
        }
        console.log("dateOfMonth:: ",dateOfMonth)

        let sd1=userassignedTask.tasktemplate.start_date;
			 	let month1=sd1.getMonth()+1;
        let startdateOfMonth="";
        if(month1 % 2 ==0){
          startdateOfMonth="even";
        }else{
          startdateOfMonth="odd";
        }
        console.log("startdateOfMonth:: ",startdateOfMonth)
        var weekOfMonth = Math.ceil(new Date(currentdate).getDate() / 7); //1
        console.log("weekOfMonth:: ",weekOfMonth)
        
        const forEndDate = new Date();
        forEndDate.setDate(new Date(currentdate).getDate() + userassignedTask.tasktemplate.end_day - userassignedTask.tasktemplate.start_day); 
        
        let month_week_no = userassignedTask.tasktemplate.month_week_no;
        let month_week_day = userassignedTask.tasktemplate.month_week_day;
        let dayOfWeek = new Date(currentdate).getDay();
        // console.log("start_day:: ",userassignedTask.tasktemplate.start_day)
        // console.log("end_day:: ",userassignedTask.tasktemplate.end_day)
        // console.log("month_week_no:: ",month_week_no)
        // console.log("month_week_day:: ",month_week_day)
        // console.log("dayOfWeek:: ",dayOfWeek)

        if(userassignedTask.tasktemplate.start_day != 0 && userassignedTask.tasktemplate.end_day != 0){
          if(new Date(date).getDate() == userassignedTask.tasktemplate.start_day && dateOfMonth == startdateOfMonth){
            taskstatusObj.start_date = new Date(currentdate);
            taskstatusObj.end_date = forEndDate;
          }
        }else{
          if(weekOfMonth == month_week_no && dayOfWeek == month_week_day){
            if(dateOfMonth == startdateOfMonth){
              taskstatusObj.start_date = new Date(currentdate);
              taskstatusObj.end_date = new Date(currentdate);
            }
          }
        }
        return taskstatusObj;
      }

      createQuarterlyTasks(taskstatusObj: ISchedulerTaskEntry,userassignedTask: UserAssignedToTask, create_task_before_days: number) {
        console.log('✅ Adding Quarterly tasks..... ');
        let currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");
        let quterlyCalendar= moments(new Date()).utc().startOf('quarter').format("YYYY/MM/DD");
        
         if(userassignedTask.tasktemplate.start_day != 0){
          quterlyCalendar = moments(quterlyCalendar).add(userassignedTask.tasktemplate.start_day-1, 'days').format("YYYY/MM/DD");
          if(quterlyCalendar == currentdate){
            taskstatusObj.start_date = new Date(currentdate);
            currentdate = moments(currentdate).add(userassignedTask.tasktemplate.end_day-userassignedTask.tasktemplate.start_day, 'days').format("YYYY/MM/DD");
            let endquterly= this.getLastDayOfQuarter(new Date(currentdate)).toDateString();
            if(endquterly <= currentdate) {
              currentdate = endquterly;
            }
            taskstatusObj.end_date = new Date(currentdate);
          }
         }else{
          let quarterMonth = new Date(quterlyCalendar).getMonth() + userassignedTask.tasktemplate.quarter_start_month;
          let currentMonth = new Date(currentdate).getMonth() + 1;
          let quarterDate = Number(userassignedTask.tasktemplate.quarter_start_date);
          let curDate = new Date(currentdate).getDate();
          console.log("quarterMonth::..................",quarterMonth);
          console.log("currentMonth::..................",currentMonth);
          console.log("quarterDate::...................",quarterDate);
          console.log("curDate::.......................",curDate);
           							
			 		if(quarterMonth == currentMonth && quarterDate == curDate) {
            taskstatusObj.start_date = new Date(currentdate);
            let quarter_end_date = new Date();
            quarter_end_date.setDate(Number(userassignedTask.tasktemplate.quarter_end_date));
            quarter_end_date.setMonth(new Date(quterlyCalendar).getMonth()+userassignedTask.tasktemplate.quarter_end_month-1);
            quarter_end_date.setFullYear(new Date(currentdate).getFullYear());
            console.log("quarter_end_date:: ",quarter_end_date);

            let endquterly= this.getLastDayOfQuarter(new Date(currentdate)).toDateString();
            if(endquterly <= quarter_end_date.toDateString()) {
              quarter_end_date = new Date(endquterly);
            }
            taskstatusObj.end_date = new Date(quarter_end_date);
          }
         }
        return taskstatusObj;
      }


      createYearlyTasks(taskstatusObj: ISchedulerTaskEntry,userassignedTask: UserAssignedToTask, create_task_before_days: number) {
        console.log('✅ Adding Yearly tasks..... ');
        let currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");

        let start_date = userassignedTask.tasktemplate.start_day;
        let start_month = userassignedTask.tasktemplate.start_month;

        if(start_date <= 31){
          console.log("date:: ",new Date(currentdate).getDate())
          console.log("start_date:: ",start_date)
          console.log("month:: ",moments(currentdate).format('MMMM'))
          console.log("start_month:: ",start_month)
          if((new Date(currentdate).getDate() == start_date && moments(currentdate).format('MMMM') == start_month)) {
            taskstatusObj.start_date = new Date(currentdate);
            let end_month = moments().month(userassignedTask.tasktemplate.end_month).format("M");
            console.log("end_month:: ",end_month);
            let end_full_date = moments(new Date()).set({'year': moments(currentdate).get('year'), 'month': Number(end_month)-1, 'date' : userassignedTask.tasktemplate.end_day });
            console.log("end_full_date:: ",end_full_date.toDate());
            taskstatusObj.end_date = end_full_date.toDate();
          }
        }
        return taskstatusObj;
      }

      createBiYearlyTasks(taskstatusObj: ISchedulerTaskEntry,userassignedTask: UserAssignedToTask, create_task_before_days: number) {
        console.log('✅ Adding Bi-Yearly tasks..... ');
        let currentdate = moments(new Date()).add(create_task_before_days, 'days').format("YYYY/MM/DD");

        let now = new Date(currentdate);
        console.log("now.getMonth():: ",now.getMonth());
        let quarter = Math.floor((now.getMonth() / 6));
        let startDate = new Date(now.getFullYear(), quarter * 6, 1);
        let quterlyCalendar= moments(startDate).format("YYYY/MM/DD");
        
        console.log("quterlyCalendar::",quterlyCalendar);

        let start_day = userassignedTask.tasktemplate.start_day;
        let end_day = userassignedTask.tasktemplate.end_day;

        if(start_day != 0){
          quterlyCalendar = moments(quterlyCalendar).add(start_day-1, 'days').format("YYYY/MM/DD");
          if(quterlyCalendar == currentdate){
            taskstatusObj.start_date = new Date(currentdate);
            currentdate = moments(currentdate).add(end_day-start_day, 'days').format("YYYY/MM/DD");
            let endquterly= this.getLastDayOfQuarter(new Date(currentdate)).toDateString();
            if(endquterly <= currentdate) {
              currentdate = endquterly;
            }
            taskstatusObj.end_date = new Date(currentdate);
          }
         }else{
          let quarterMonth = new Date(quterlyCalendar).getMonth()+userassignedTask.tasktemplate.quarter_start_month;
          let currentMonth = new Date(currentdate).getMonth()+1;
          let quarterDate = Number(userassignedTask.tasktemplate.quarter_start_date);
          let curDate = new Date(currentdate).getDate();
          console.log("quarterMonth::..................",quarterMonth);
          console.log("currentMonth::..................",currentMonth);
          console.log("quarterDate::...................",quarterDate);
          console.log("curDate::.......................",curDate);
           							
			 		if(quarterMonth == currentMonth && quarterDate == curDate) {
            taskstatusObj.start_date = new Date(currentdate);

            let quarter_end_date = new Date();
            quarter_end_date.setDate(Number(userassignedTask.tasktemplate.quarter_end_date));
            quarter_end_date.setMonth(new Date(quterlyCalendar).getMonth()+userassignedTask.tasktemplate.quarter_end_month-1);
            quarter_end_date.setFullYear(new Date(currentdate).getFullYear());
            console.log("quarter_end_date:: ",quarter_end_date);

            let endquterly= this.getLastDayOfQuarter(new Date(currentdate)).toDateString();
            if(endquterly <= quarter_end_date.toDateString()) {
              quarter_end_date = new Date(endquterly);
            }
            taskstatusObj.end_date = new Date(quarter_end_date);
          }
         }
        return taskstatusObj;
      }

      getLastDayOfQuarter(date) {
        var year = date.getFullYear();
        var quarterEndings = [[6, 30], [12, 31]];
      
        var toDateObj = function (dates) {
          return new Date(year, dates[0] - 1, dates[1]);
        };
      
        var isBeforeEndDate = function (endDate) {
          return endDate >= date;
        }
      
        date.setHours(0, 0, 0, 0);
      
        return quarterEndings
          .map(toDateObj)
          .filter(isBeforeEndDate)[0];
      }
    

}