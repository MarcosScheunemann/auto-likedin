import { Module } from '@nestjs/common';
import { GetNewsModule } from './get-news/get-news.module';
import { ScrapingModule } from './scraping/scraping.module';
@Module({
  imports: [GetNewsModule, ScrapingModule],
  providers: [],
  exports: [GetNewsModule, ScrapingModule],
})
export class GNewsModule {}
