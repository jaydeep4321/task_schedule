import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './cron/service/config/orm.config';
import { CronModule } from './cron/cron.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TenancyModule } from './tenancy/tenancy.module';
import orm2Config from './cron/service/config/orm2.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: ormConfig,
    }),
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   load: [orm2Config]
    // }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: orm2Config
    // }),
    CronModule,
    ScheduleModule.forRoot(),
    TenancyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
