import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { GNewsModule } from './g-news/g-news.module';
import { IaController } from './ia-controller';
import { IaService } from './ia.services';
import { GetTopicModule } from '../topics/topics.module';
import { LinkedInModule } from '../linkedin/linkedin.module';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [GptModule, GNewsModule, GetTopicModule, LinkedInModule, EnvModule],
  exports: [GptModule, GNewsModule],
  providers: [IaService],
  controllers: [IaController],
})
export class IaServicesModule {}
