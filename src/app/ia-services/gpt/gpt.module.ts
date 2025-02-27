import { Module } from '@nestjs/common';
import { GptService } from './gpt.service';

@Module({
  controllers: [],
  providers: [GptService],
  exports: [GptService],
})
export class GptModule {}
