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
    try {
      const canPass = await this.linkedInService.canPass(code);
      // const canPass = true
      if (!canPass) {
        return;
      }
      // console.log('Passo 1 = get topic.');
      const topic = this.getTopicService.execute();
      // console.log('topic', topic);
      // console.log('Passo 2 = fazer web scraping.');
      const news = await this.getNewsService.execute(topic);
      // console.log('Passo 3 = fazer um resumo.');
      // console.log('news', news);
      const gptResume = await this.gptService.makeResume(news.items);
      // console.log('Passo 4 = transformar em um post.');
      // console.log('gptRes', gptResume);
      const post = await this.gptService.makePostText(gptResume);
      // console.log('Passo 5 = post linkedIn.');
      // console.log('post', post);
      return await this.linkedInService.makePost(post);
    } catch (error) {
      // console.log('Error', error);
      throw error;
    }
  }
}
