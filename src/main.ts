import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/env.validation';
import { setupApp } from './setup/app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);

  const config = app.get(ConfigService<EnvironmentVariables, true>);
  const port = config.get('PORT', { infer: true });
  await app.listen(port);
  Logger.log(`API en http://localhost:${port}/api`, 'Bootstrap');
}

void bootstrap();
