import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS if needed
  app.enableCors();
  await app.listen(process.env.PORT ?? 5000);
  console.log(`Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
