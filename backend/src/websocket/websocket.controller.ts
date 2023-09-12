import { Controller, UseGuards } from "@nestjs/common";
import { Put , Get, Param} from "@nestjs/common";
import { AuthGuard } from '../auth/guards/auth.guard';
import { WebsocketService } from "./websocket.service";
import { WebsocketGateway } from "./websocket.gateway";

@UseGuards(AuthGuard)
@Controller('websocket')
export class WebsocketController {
    constructor(private websocketService: WebsocketService, private websocketGateway: WebsocketGateway) {}

	@UseGuards(AuthGuard)
	@Get('getClient')
	async get()
	{
		return this.websocketGateway.getClient();
	}
}