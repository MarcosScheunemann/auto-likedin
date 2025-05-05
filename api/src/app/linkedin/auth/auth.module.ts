
import { Module } from '@nestjs/common';
import { LinkedInAuthService } from './auth.service';
import { EnvModule } from '../../env/env.module';

@Module({
  imports: [EnvModule],
  providers: [LinkedInAuthService],
  exports: [LinkedInAuthService],
})
export class LinkedInAuthModule {}