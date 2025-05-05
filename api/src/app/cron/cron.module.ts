import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from './cron.service';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    EnvModule
  ],
  providers: [CronService],
})
export class CronModule {}
