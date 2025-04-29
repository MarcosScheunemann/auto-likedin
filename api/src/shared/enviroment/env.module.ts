import { Module } from '@nestjs/common';
import { EnvValidationService } from './env.service';

@Module({
  providers: [EnvValidationService], 
})
export class EnvValidationModule {}
