import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LinkedInModule } from '../linkedin/linkedin.module';
import { CronService } from './cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LinkedInModule, // vamos precisar do LinkedInService
  ],
  providers: [CronService],
})
export class CronModule {}