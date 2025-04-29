
import { Module } from '@nestjs/common';
import { LinkedInService } from './linkedin.service';
import { LinkedInAuthModule } from './auth/auth.module';

@Module({
  imports: [LinkedInAuthModule],
  providers: [LinkedInService],
  exports: [LinkedInService],
})
export class LinkedInModule {}