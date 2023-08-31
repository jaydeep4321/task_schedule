import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { QILocations } from '../model/qi-locations.entity';
import { TaskTemplate } from '../model/task-template.entity';
import { UserAssignedToTask } from '../model/user-assigned-task.entity';
import { User } from '../model/user.entity';
import { City } from '../model/cities.entity';
import { State } from '../model/states.entity';
import { Role } from '../model/role.entity';
import { Country } from '../model/countries.entity';
import { PeriodicTaskStatus } from '../model/periodic-task-status.entity';
import { SchedulerTaskEntry } from '../model/scheduler-task-entry.entity';

export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.importService = {
      options: {
        host: process.env.IMPORT_SERVICE_HOST,
        port: parseInt(process.env.IMPORT_SERVICE_PORT, 10),
      },
      transport: Transport.TCP,
    } as MicroserviceOptions;
    this.envConfig.userService = {
      options: {
        host: process.env.USER_SERVICE_HOST,
        port: parseInt(process.env.USER_SERVICE_PORT, 10),
      },
      transport: Transport.TCP,
    } as MicroserviceOptions;
    this.envConfig.db = {
      type: process.env.DB_CONNECTION,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      synchronize: false,
      poolSize: 10,
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
        SchedulerTaskEntry
      ],
    };
    this.envConfig.tenantdb = {
      ...this.envConfig.db,
      poolSize: 10,
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
        SchedulerTaskEntry
      ],
      synchronize: false,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
