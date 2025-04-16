import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LinkedInModule } from '../linkedin/linkedin.module';
import { CronService } from './cron.service';
import { GetTopicModule } from '../topics/topics.module';
import { IaServicesModule } from '../ia-services/ia-services.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    LinkedInModule,
    GetTopicModule,
    IaServicesModule,
  ],
  providers: [CronService],
})
export class CronModule {}
