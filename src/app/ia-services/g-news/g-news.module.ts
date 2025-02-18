import { Module } from '@nestjs/common';
import { GetNewsModule } from './get-news/get-news.module';
import { ScrappingModule } from './scrapping/scrapping.module';
@Module({
  imports: [GetNewsModule, ScrappingModule],
  providers: [],
  exports: [GetNewsModule, ScrappingModule],
})
export class GNewsModule {}
