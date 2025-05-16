import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EnvService } from '../env/env.service';

@Injectable()
export class CronService {
  constructor(
    private readonly envService: EnvService
  ) { }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    console.log('[Cron] Verificando status...');
    try {
      await this.envService.getCredentials(this.envService.token)
      console.log('[Cron] Status Verificado com sucesso.');
    } catch (err) {
      console.error('[Cron] Erro ao processar status:', err);
    }
  }
}
