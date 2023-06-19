import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

process.on("uncaughtException", function (error) {
  console.log("uncaughtException");
  console.log(error.stack);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
}
bootstrap();
