
import { Module } from '@nestjs/common';
import { LinkedInService } from './linkedin.service';
import { LinkedInAuthModule } from './auth/auth.module';
import { LikedInController } from './linkedin.controller';
import { EnvModule } from '../env/env.module';

@Module({
  imports: [LinkedInAuthModule, EnvModule],
  providers: [LinkedInService],
  exports: [LinkedInService],
  controllers: [LikedInController]
})
export class LinkedInModule {}