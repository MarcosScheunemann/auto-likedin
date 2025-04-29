
import { Module } from '@nestjs/common';
import { LinkedInAuthService } from './auth.service';

@Module({
  imports: [],
  providers: [LinkedInAuthService],
  exports: [LinkedInAuthService],
})
export class LinkedInAuthModule {}