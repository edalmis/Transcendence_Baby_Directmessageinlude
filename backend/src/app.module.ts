// import { Module } from '@nestjs/common';
// import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule } from '@nestjs/config';
// import { HttpModule } from '@nestjs/axios';
// import { AppController } from './app.controller';
// import { UserModule } from './users/user.module';
// import { AuthModule } from './auth/auth.module';
// import { GameModule } from './game/game.module';

// @Module({
//   imports: [
//     HttpModule,
//     ConfigModule.forRoot({ isGlobal: true }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: process.env.POSTGRES_USER,
//       password: process.env.POSTGRES_PASSWORD,
//       database: process.env.POSTGRES_DB,
//       autoLoadEntities: true,
//       synchronize: true,
//     }),
//     UserModule,
//     AuthModule,
//     GameModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService, EventsGateway],
// })
// export class AppModule { }






// // // * * *  -[ CORS PB ]-  * * * 
// // import { CorsModule } from '@nestjs/cors';
// import { EventsGateway } from './events/events.gateway';

// // @Module({
// //   imports: [
// //     // Autres modules importés
// //     CorsModule.forRoot({
// //       origin: '*', // Remplace * par l'URL spécifique de ton frontend en production
// //       methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
// //       allowedHeaders: 'Content-Type,Authorization', // Ajoute 'Authorization' ici
// //     }),
// //   ],
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import {WebsocketGateway} from './websocket/websocket.gateway'
import { EventsGateway } from './events/events.gateway'; // Place it here

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    GameModule,
  ],
  controllers: [AppController],
  // providers: [AppService, EventsGateway], // Now, EventsGateway is defined before this line
  providers: [AppService, WebsocketGateway],
})
export class AppModule { }
