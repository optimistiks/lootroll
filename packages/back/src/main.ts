import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ExpressPeerServer } from "peer";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const httpAdapter = app.getHttpAdapter();
  const peerServer = ExpressPeerServer(httpAdapter.getHttpServer(), {
    path: "/myapp"
  });
  app.use("/peerjs", peerServer);
  await app.listen(3001);
}
bootstrap();
