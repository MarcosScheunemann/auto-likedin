import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CronModule } from './cron/cron.module';
import { LinkedInModule } from './linkedin/linkedin.module';
import { IaServicesModule } from './ia-services/ia-services.module';
import { GetTopicModule } from './topics/topics.module';
import { EnvModule } from './env/env.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    CronModule,
    GetTopicModule,
    LinkedInModule,
    IaServicesModule,
    EnvModule,
  ]
})
export class AppModule {}
