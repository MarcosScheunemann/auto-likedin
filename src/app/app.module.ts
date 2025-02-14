import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from '../shared/firebase/firebase.module';
import { CronModule } from './cron/cron.module';
import { LinkedInModule } from './linkedin/linkedin.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    FirebaseModule,
    CronModule,
    LinkedInModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
