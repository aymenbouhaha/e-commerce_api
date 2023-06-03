import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {ClassSerializerInterceptor, ValidationPipe} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
      {
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      }
  ));
  //   app.use(function (req, res, next) {
  //       //Enabling CORS
  //       res.header("Access-Control-Allow-Origin", "*");
  //       res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  //       res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
  //       next();
  //   });
  const corsOptions = {
      origin : "http://localhost:4200",
      optionsSuccessStatus : 200
  }
  app.enableCors(corsOptions)
  app.useGlobalInterceptors(
      new ClassSerializerInterceptor(
          app.get(Reflector)
      )
  );
  await app.listen(3000);
}
bootstrap();
