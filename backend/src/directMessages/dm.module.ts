// directMessages.module.ts
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from "src/users/user.module";
import { DirectMessageController } from "./dm.controller";
import { DirectMessageService } from "./dm.service";
import { DirectMessageGateway } from "./dm.gateway";
import { DirectMessage } from '../directMessages/orm/directMessage.entity';
import { DirectMessageRoom } from '../directMessages/orm/directMesssageRoom.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [DirectMessage, DirectMessageRoom],
      synchronize: true,
    }),
    JwtModule,
    UserModule,
    // You'll probably need to include the entities associated with the DirectMessageService
    // in a TypeOrmModule.forFeature([]) import if they are not part of the root TypeOrmModule.forRoot() entities array.
  ],
  controllers: [DirectMessageController],
  providers: [DirectMessageService, DirectMessageGateway],
})
export class DirectMessagesModule {}
