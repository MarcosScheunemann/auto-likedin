import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { GNewsModule } from './g-news/g-news.module';
import { IaController } from './ia-controller';
import { IaService } from './ia.services';

@Module({
  imports: [GptModule, GNewsModule, IaService],
  exports: [GptModule, GNewsModule],
  controllers: [IaController],
})
export class IaServicesModule {}
