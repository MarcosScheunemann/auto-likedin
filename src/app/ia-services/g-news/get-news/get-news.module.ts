import { Module } from '@nestjs/common';
import { GetNewsService } from './get-news.service';
import { ScrapingModule } from '../scraping/scraping.module';
@Module({
  imports: [ScrapingModule],
  providers: [GetNewsService],
  exports: [GetNewsService],
})
export class GetNewsModule {}
