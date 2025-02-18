
// src/news/news.module.ts

import { Module } from '@nestjs/common';
import { ScrapingService } from './scrapping.service';

@Module({
  providers: [ScrapingService],
  exports: [ScrapingService],
})
export class ScrappingModule {}
