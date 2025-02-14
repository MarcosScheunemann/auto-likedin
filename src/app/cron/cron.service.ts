import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LinkedInService } from '../linkedin/linkedin.service';

@Injectable()
export class CronService {
  constructor(private readonly linkedInService: LinkedInService) {}

  // Exemplo de tarefa agendada para rodar a cada 1 hora
  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('[Cron] Verificando postagens agendadas...');
    
    // Busca no Firebase as postagens que precisam ser publicadas
    // Chama método do LinkedInService para postar
    try {
      await this.linkedInService.publishScheduledPosts();
      console.log('[Cron] Postagens processadas com sucesso.');
    } catch (err) {
      console.error('[Cron] Erro ao processar postagens:', err);
    }
  }
}
