
import { Module } from '@nestjs/common';
import { GetTopicService } from './topics.service';

@Module({
  imports: [],
  providers: [GetTopicService],
  exports: [GetTopicService],
})
export class GetTopicModule {}