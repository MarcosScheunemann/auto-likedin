

import { Module } from '@nestjs/common';
import { EnvService } from './env.service';

@Module({
  imports: [],
  providers: [EnvService],
  exports: [EnvService],
  controllers: []
})
export class EnvModule {}