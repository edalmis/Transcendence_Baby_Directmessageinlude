// import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

// @WebSocketGateway()
// export class EventsGateway {
//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
// }
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';

@WebSocketGateway(3001) // You can specify a different port if you want
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  handleConnection(client: any, ...args: any[]) {
    console.log('a user connected');
  }

  handleDisconnect(client: any) {
    console.log('user disconnected');
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
