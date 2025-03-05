import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AuthMiddleware } from './common/middlewares/auth.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  // app.use(AuthMiddleware);

  const corsConfig = configService.get<CorsOptions>('cors');
  app.enableCors(corsConfig);

  const appConfig = configService.get('app');
  const { port } = appConfig;
  await app.listen(port);
}
bootstrap();
