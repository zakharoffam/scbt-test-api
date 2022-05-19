import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 8080;
  const prefix = 'api';
  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port, () => {
    Logger.log(
      `Сервер успешно запущен по адресу: http://localhost:${port}/${prefix}`,
      `main.bootstrap()`,
    );
  });
})();
