import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { GetNewsService } from './ia-services/g-news/get-news/get-news.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly getNewsService: GetNewsService,
  ) {}
  @Get()
  async gete() {
    // TODO: Remover TESTE
    console.log('GET /')
    return await this.getNewsService.execute('Tesla');
  }
  @Get('oi')
  getHello(): string {
    return this.appService.getHello();
  }
}
