import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { AppModule } from './app.module';
import { helmet } from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security middleware
  app.use(helmet());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global throttler guard
  app.useGlobalGuards(app.get(ThrottlerGuard));

  // CORS configuration
  app.enableCors({
    origin: configService.get('cors.origin'),
    credentials: true,
  });

  const port = configService.get('app.port');
  await app.listen(port);

  console.log(`🚀 PPDU Backend is running on port ${port}`);
}

bootstrap();
