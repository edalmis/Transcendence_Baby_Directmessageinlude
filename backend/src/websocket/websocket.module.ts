import { Module } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { WebsocketController } from "./websocket.controller";
import { WebsocketGateway } from "../websocket/websocket.gateway";
import { WebsocketService } from "./websocket.service";

@Module({
    imports: [],
    controllers: [WebsocketController],
    providers: [WebsocketService, WebsocketGateway, UserService],
})
export class WebsocketModule {}