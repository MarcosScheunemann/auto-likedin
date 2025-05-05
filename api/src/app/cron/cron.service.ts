import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronService {
  constructor(
    
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    console.log('[Cron] Verificando status com linkedin...');
    try {
      console.log('[Cron] Status Verificado com sucesso.');
    } catch (err) {
      console.error('[Cron] Erro ao processar postagens:', err);
    }
  }
}
