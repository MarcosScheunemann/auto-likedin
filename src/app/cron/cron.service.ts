import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LinkedInService } from '../linkedin/linkedin.service';
import { AppService } from '../app.service';
import { GetNewsService } from '../ia-services/g-news/get-news/get-news.service';
import { GptService } from '../ia-services/gpt/gpt.service';
import { GetTopicService } from '../topics/topics.service';

@Injectable()
export class CronService {
  constructor(
        private readonly getTopicService: GetTopicService,
        private readonly getNewsService: GetNewsService,
        private readonly gptService: GptService,
        private readonly linkedInService: LinkedInService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('[Cron] Verificando postagens agendadas...');
    const appService = new AppService(this.getTopicService, this.getNewsService, this.gptService, this.linkedInService);
    try {
      await appService.oneforAll();
      console.log('[Cron] Postagens processadas com sucesso.');
    } catch (err) {
      console.error('[Cron] Erro ao processar postagens:', err);
    }
  }
}
