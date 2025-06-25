import { Injectable } from '@nestjs/common';
import { GetTopicService } from '../topics/topics.service';
import { GetNewsService } from './g-news/get-news/get-news.service';
import { GptService } from './gpt/gpt.service';

@Injectable()
export class IaService {
    constructor(
        private readonly getTopicService: GetTopicService,
        private readonly getNewsService: GetNewsService,
        private readonly gptService: GptService,
    ) { }
    async makeText(topic?: string, inspiration?: string, job?: string) {
        try {
            if (!topic) {
                topic = this.getTopicService.execute();
            }
            const news = await this.getNewsService.execute(topic);
            const gptResume = await this.gptService.makeResume(news.items);
            return await this.gptService.makePostText(gptResume, inspiration, job);
        } catch (error) {
            throw error;
        }
    }
}
