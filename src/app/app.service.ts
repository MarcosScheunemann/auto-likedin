import { Injectable } from '@nestjs/common';
import { GetTopicService } from './topics/topics.service';
import { GetNewsService } from './ia-services/g-news/get-news/get-news.service';
import { GptService } from './ia-services/gpt/gpt.service';

@Injectable()
export class AppService {
  constructor(
    private readonly getTopicService: GetTopicService,
    private readonly getNewsService: GetNewsService,
    private readonly gptService: GptService,
  ) {}
 async oneforAll() {
    const topic = this.getTopicService.execute();
    const news = await this.getNewsService.execute(topic);
    const gptRes = await this.gptService.execute(news.item)
  }
}
