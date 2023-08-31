import { Module } from "@nestjs/common";
import { CronService } from "./service/cron.service";
import { CronController } from "./cron.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Organization } from "./model/organization.entity";
import { City } from "./model/cities.entity";
import { QILocations } from "./model/qi-locations.entity";
import { TaskTemplate } from "./model/task-template.entity";
import { UserAssignedToTask } from "./model/user-assigned-task.entity";
import { User } from "./model/user.entity";
import { State } from "./model/states.entity";
import { Role } from "./model/role.entity";
import { Country } from "./model/countries.entity";
import { PeriodicTaskStatus } from "./model/periodic-task-status.entity";
import { SchedulerTaskEntry } from "./model/scheduler-task-entry.entity";
import { CronImplService } from "./service/cronimpl.service";

@Module({
    imports: [TypeOrmModule.forFeature(
        [
            QILocations,
            TaskTemplate,
            UserAssignedToTask,
            User,
            City,
            State,
            Role,
            Country,
            PeriodicTaskStatus,
            SchedulerTaskEntry,
            Organization
        ]),
    ],
    controllers: [CronController],
    providers: [CronService,CronImplService],
    exports: [CronService,CronImplService],
  })
  export class CronModule {}