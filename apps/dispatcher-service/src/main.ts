import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { add } from '@e-ticaret/database';

(() => {
  const a: number = add(1, 2);
  console.log(a);
})();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
