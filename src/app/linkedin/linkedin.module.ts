
import { Module } from '@nestjs/common';
import { LinkedInService } from './linkedin.service';

@Module({
  imports: [],
  providers: [LinkedInService],
  exports: [LinkedInService],
})
export class LinkedInModule {}