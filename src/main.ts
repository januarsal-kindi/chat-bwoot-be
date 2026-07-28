import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  configureApp(app);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Chat Bot API')
    .setDescription(
      'Credentials are delivered as HttpOnly cookies (`access_token`, `refresh_token`) — ' +
        'never returned in response bodies. ' +
        'All mutating requests must include a matching `Origin` header.',
    )
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();

  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  await app.listen(config.getOrThrow<number>('PORT'));
}
void bootstrap();
