import {
  BadRequestException,
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.oneforAll();
  }

  @Get('callback')
  async getCallback(@Query('code') code: string) {
    if (!code) {
      throw new BadRequestException('❌ Código de autorização ausente!');
    }
    await this.appService.oneforAll(code);
  }
}
