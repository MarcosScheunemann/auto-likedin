import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LinkedInService } from '../linkedin/linkedin.service';

@Injectable()
export class CronService {
  constructor(private readonly linkedInService: LinkedInService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('[Cron] Verificando postagens agendadas...');
    
    try {
      // await this.linkedInService.publishScheduledPosts();
      console.log('[Cron] Postagens processadas com sucesso.');
    } catch (err) {
      console.error('[Cron] Erro ao processar postagens:', err);
    }
  }
}
