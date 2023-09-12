import { Controller, Get, Headers, Query } from "@nestjs/common";
import { UserService } from "src/users/user.service";
import { DirectMessageService } from "./dm.service";
import { string } from "@colyseus/schema/lib/encoding/decode";
import { JwtService } from "@nestjs/jwt";
export interface Message {
  sender: string;
  content: string;
  timestamp: Date;
}
let connectedUsers:any ;

@Controller('dm')
export class DirectMessageController {
  constructor(
   private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly dmService: DirectMessageService,
  ) {}
  
  @Get('getRoomData')
  async handleRoomData(@Headers('Authorization') req){

    let login: string;
    const token = req.headers.authorization;
        if (token) {
            const jwt = token.replace('Bearer', '').trim();
            const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
            login = decoded.login
        }

    const user =await this.userService.find_user_by_login(login);

    const rooms = await this.dmService.findRoomsByUserId(user.id);

    let customRooms = [];
    for (let room of rooms) {
      let customRoom = { ...room };
      customRoom.name = (user.id === room.ownerOne.id) ? room.ownerTwo.userName : room.ownerOne.userName;
      customRooms.push(customRoom);
    }
    
    return {
      rooms: customRooms,
      user,
    };
  }

  @Get('who')
  async handleWho(@Headers('Authorization') @Query('id') userId: number, req) {
    try {
      let login: string;
      const token = req.headers.authorization;
          if (token) {
              const jwt = token.replace('Bearer', '').trim();
              const decoded = this.jwtService.decode(jwt) as { [key: string]: any };
              login = decoded.login
          }
  
      const user =await this.userService.find_user_by_login(login);   
      userId = user.id;
      const who = await this.userService.find_user_by_id(userId);
      if (!who) {
        return null;}
      if (!user) {
        return null;
      }
      
    
      
      let rooma = await this.dmService.findRoomBetweenUsers(user.userName, who.userName);
      let meserEntityssagesExist = true;

      let messagesExist= true;
      if (!rooma) {
        messagesExist = false;
        let rooms: { roomId: number; messages: Message[]; };
        rooms= await this.dmService.createRoom(user, who);
      }
      let room: { roomId: number; messages: Message[]; };
      
      return {
      
        msg: messagesExist ? room.messages : [],
        who,
      };

    } catch (error) {
      return null;
    }
  }
}
