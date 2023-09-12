// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { config } from 'dotenv';
// import * as express from 'express';
// config();
// import * as bodyParser from 'body-parser';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.use(express.json());
//   // app.use(bodyParser.json());
//   app.enableCors({
//     origin: '*',
//     methods: 'GET,POST',
//     credentials: true,
//     allowedHeaders: 'Content-Type, Authorization, Accept',
//   });

//   // app.use(cors({
//   //   origin: 'http://localhost:5173', // URL frontend
//   //   credentials: true, // Pour entêtes d'autorisation ou cookies
//   // }));
//   //---------------------------------------------------------------------------------
//   const cors = require('cors');
//   app.use(cors());
//   app.use(cors({
//     origin: 'http://localhost:3000'
//   }));
  

//   //-----------------------------------------------------------------------------
//   await app.listen(3000);
//   console.log(`Backend is running on port 3000.`);
// }
// bootstrap();
//------------------------****************************************************---------------
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   app.enableCors({
//     origin: '*', // the origin you want to allow
//     methods: ['GET', 'POST'],  // the methods you want to allow
//     credentials: true,  // indicating that the actual request can include user credentials
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // the headers you want to allow
//   });
  
//   await app.listen(3000);
//   console.log(`Backend is running on port 3000.`);
// }
// bootstrap();

////-------------------------------------***********------------------------------------

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SocketIoAdapter } from './socket-io.adapter';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  await app.listen(3000);
  console.log(`Backend is running on port 3000.`);
}

bootstrap();
