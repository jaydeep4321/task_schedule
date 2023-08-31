import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { City } from "src/cron/model/cities.entity";
import { Country } from "src/cron/model/countries.entity";
import { Organization } from "src/cron/model/organization.entity";
import { PeriodicTaskStatus } from "src/cron/model/periodic-task-status.entity";
import { QILocations } from "src/cron/model/qi-locations.entity";
import { Role } from "src/cron/model/role.entity";
import { SchedulerTaskEntry } from "src/cron/model/scheduler-task-entry.entity";
import { State } from "src/cron/model/states.entity";
import { TaskTemplate } from "src/cron/model/task-template.entity";
import { UserAssignedToTask } from "src/cron/model/user-assigned-task.entity";
import { User } from "src/cron/model/user.entity";


export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE2,
    entities: [
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
    ],
    synchronize: false
  })
);