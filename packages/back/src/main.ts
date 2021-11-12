import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressPeerServer } from "peer";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapter = app.getHttpAdapter();
  const peerjs = ExpressPeerServer(httpAdapter.getInstance(), { path: "/" });
  app.use("/rtc", peerjs);
  await app.listen(3001);
}
bootstrap();
