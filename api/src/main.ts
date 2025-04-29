import {
  BadRequestException,
  INestApplication,
  Logger,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ExceptionsFilter } from './shared/filters/exceptions.filter';
import { SanitizePipe } from './shared/pipes/sanitize.pipe';

let app: INestApplication;
export function nestApp(): INestApplication {
  return app;
}
async function bootstrap() {
  app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  // 1. Global Filters
  app.useGlobalFilters(new ExceptionsFilter());

  // 2. CORS
  const corsOptions = {
    maxAge: 86400,
    origin: true,
    allowedHeaders: [
      'authorization',
      'cache-control',
      'accept',
      'accept-version',
      'content-type',
      'request-id',
      'origin',
      'x-api-version',
      'x-request-id',
      'x-requested-with',
    ],
    exposedHeaders: '*',
    methods: '*',
    credentials: true,
  };
  app.enableCors(corsOptions);
  // 3. Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        let messages = errors
          .map((error) => Object.values((error as any)?.constraints))
          .reduce((a, b) => a.concat(b));
        return new BadRequestException(messages);
      },
    }),
    new SanitizePipe(),
  );

  // 6. Start Application
  await app.listen(process?.env['PORT'] || 8081);
  Logger.log('APi is available at: http://localhost:' + (process?.env['PORT'] || 8081) + '/');
}
bootstrap();
