import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { from, lastValueFrom, map } from "rxjs";
import { Organization } from "../model/organization.entity";
import { Repository } from "typeorm";
import { Cron } from '@nestjs/schedule';
import { OrganizationInterface } from "../model/interfaces/organization.interface";
import { CronImplService } from "./cronimpl.service";

@Injectable()
  export class CronService {
    private readonly logger = new Logger(CronService.name);
    constructor(
        @InjectRepository(Organization)
        private readonly orgRepository: Repository<Organization>,
        private readonly cronImplService: CronImplService,
    ) {}

    // @Cron('0 */1 * * * *')
    // async handleCron(): Promise<void> {

    //   const tenantId = process.env.SUPERADMIN_URL;
    //   //console.log("tenantID::",tenantId)

    //   let allOrganization: OrganizationInterface[];
    //   try {
    //     this.logger.debug("Fetching Organizations...");
    //     allOrganization = await lastValueFrom(
    //       this.cronImplService.findAll(tenantId).pipe(
    //         map((orgs: OrganizationInterface[]) => {
    //           //console.log("orgs11::",orgs)
    //           return orgs;
    //         })
    //       )
    //     );
    //   } catch (error) {
    //     this.logger.debug("Error in Fetching Organizations " + error?.message);
    //   }
    // }

      
    private async getAllOrganizations() {
      const tenantId = process.env.SUPERADMIN_URL;
  
      let allOrganization: OrganizationInterface[];
      try {
        this.logger.debug("Fetching Organizations...");
        allOrganization = await lastValueFrom(
          this.cronImplService.findAll(tenantId).pipe(
            map((orgs: OrganizationInterface[]) => {
              //console.log("orgs11::",orgs)
              return orgs;
            })
          )
        );
      } catch (error) {
        this.logger.debug("Error in Fetching Organizations " + error?.message);
      }
  
      return allOrganization;
    }
  
    @Cron("0 */1 * * * *") // Every 15 Minutes
    async scheduleTaskEntry() {
      this.logger.debug("Task Entry Cron running...");
      const allOrganization = await this.getAllOrganizations();

      // console.log("allOrganization::",allOrganization)
  
      await Promise.all(
        allOrganization.map(async (org) => {
          const tenantId = org.sub_domain;
          const org_id = org.id;
          const create_task_before_days = 2;
          try {
            if(org.status == "Active"){
              let taskStatus = await lastValueFrom(
                this.cronImplService.enterScheduledTasks({
                  tenantId, 
                  org_id,
                  create_task_before_days
                }).pipe(
                  map((response: any) => {
                    this.logger.debug(response?.message);
                    return response;
                  })
                )
              );
            }
          } catch (error) {
            this.logger.debug("Error in Creating tasks " + error?.message);
          }
        })
      );
      this.logger.debug("Task Entry Cron run successfully...");
    }

    @Cron("0 */5 * * * *") // Every 15 Minutes
    async createTask() {
      this.logger.debug("Create task Cron running...");
      const allOrganization = await this.getAllOrganizations();

      await Promise.all(
        allOrganization.map(async (org) => {
          const tenantId = org.sub_domain;
          const org_id = org.id;
          try {
            if(org.status == "Active"){
              let taskStatus = await lastValueFrom(
                this.cronImplService.createScheduledTasks({
                  tenantId, 
                  org_id
                }).pipe(
                  map((response: any) => {
                    this.logger.debug(response?.message);
                    return response;
                  })
                )
              );
            }
          } catch (error) {
            this.logger.debug("Error in Creating tasks " + error?.message);
          }
        })
      );
      this.logger.debug("Create task Cron run successfully...");
    }

    

  }