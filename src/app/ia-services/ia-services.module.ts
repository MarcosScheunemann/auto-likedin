import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { GNewsModule } from './g-news/g-news.module';

@Module({
  imports: [GptModule, GNewsModule],
  controllers: [],
  exports: [GptModule, GNewsModule],
})
export class IaServicesModule {}
