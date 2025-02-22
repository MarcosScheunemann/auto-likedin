import { Injectable } from '@nestjs/common';
import { GetTopicService } from './topics/topics.service';
import { GetNewsService } from './ia-services/g-news/get-news/get-news.service';
import { GptService } from './ia-services/gpt/gpt.service';
import { LinkedInService } from './linkedin/linkedin.service';

@Injectable()
export class AppService {
  constructor(
    private readonly getTopicService: GetTopicService,
    private readonly getNewsService: GetNewsService,
    private readonly gptService: GptService,
    private readonly linkedInService: LinkedInService,
  ) {}
  async oneforAll(code?: string) {
    const canPass = await this.linkedInService.canPass(code);
    if (!canPass) {
      return;
    }
    // const topic = this.getTopicService.execute();
    // const news = await this.getNewsService.execute(topic);
    // const gptRes = await this.gptService.execute(news.item)
    const gptRes = 'Uma postagem automática aqui';
    return 'Uma postagem automática aqui'
  }
}
