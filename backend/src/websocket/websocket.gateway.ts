import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { OnGatewayDisconnect, OnGatewayConnection } from '@nestjs/websockets';
import { io } from 'socket.io-client';
import { UserService } from '../users/user.service';
import { DirectMessageService } from '../directMessages/dm.service';
import { UserEntity } from '../users/orm/user.entity';
import { getRepository } from 'typeorm';
import { JwtService, JwtModule} from '@nestjs/jwt';
import { Controller, Get, Headers, Query } from "@nestjs/common";
import { EntityManager } from 'typeorm';
import { Socket } from 'dgram';

@WebSocketGateway({cors : true})
export class WebsocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(
 

    private readonly userService: UserService,
    
  
    private readonly entityManager: EntityManager,
  ) {}


  @WebSocketServer()
  server: Server;
  clients: Map<string, string> = new Map();

  async handleConnection(client: any, ...args: any[]) { 
    client.on('userConnected', async (payload) => {
      const pseudo = payload.pseudo;
      if (this.clients.has(pseudo)) { 
        this.clients.set(pseudo, client.id);
        return;
      }
      this.clients.set(pseudo, client.id);
     // await this.userService.updateConnectedStatus(pseudo, 'online'); // The userService should use typeorm to update the status
    });
  }

  async handleDisconnect(client: any) {
    this.clients.forEach(async (value, key) => {
      if (value === client.id) {
        //await this.userService.updateConnectedStatus(key, 'offline'); // The userService should use typeorm to update the status
        this.clients.delete(key);
      }
    });
  }

//   async getClient() {
//     const newmap = this.clients;
//     const vector = [];

//     // Get User repository
//     //const userRepository = getRepository(User);
//     const userRepository = this.userService;
//     for (const [key, value] of newmap.entries()) {
//         const user = await this.userService.({
//             where: {
//                 pseudo: key
//             },
//             select: ['id', 'username', 'connected']
//         });

//         if (user) {
//             vector.push({
//                 id: user.id,
//                 username: user.username,
//                 connected: user.connected,
//             });
//         }
//     }

//     return vector;
// }
async getClient() {
  const newmap = this.clients;
  const vector = [];

  for (const [key, value] of newmap.entries()) {
    const user = await this.userService.findUniqueByPseudo({
      where: {
        pseudo: key
      },
      select: ['id', 'userName', 'connected']
    });

    if (user) {
      vector.push({
        id: user.id,
        username: user.username,
        connected: user.connected,
      });
    }
  }
  return vector;
}



}



