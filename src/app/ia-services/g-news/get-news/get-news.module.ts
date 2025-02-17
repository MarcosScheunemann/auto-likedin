import { Module } from '@nestjs/common';
import { GetNewsService } from './get-news.service';
@Module({
  imports: [],
  providers: [GetNewsService],
  exports: [GetNewsService],
})
export class GetNewsModule {}
