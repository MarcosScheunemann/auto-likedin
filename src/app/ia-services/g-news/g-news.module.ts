import { Module } from '@nestjs/common';
import { GetNewsModule } from './get-news/get-news.module';
@Module({
  imports: [GetNewsModule],
  providers: [],
  exports: [GetNewsModule],
})
export class GNewsModule {}
