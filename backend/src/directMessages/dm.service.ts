import { Injectable, NotFoundException } from "@nestjs/common";
//import { User } from "@prisma/client";
//import { PrismaService } from "src/prisma/prisma.service";
//-----------------------------------------------
import { DirectMessageRoom } from "../directMessages/orm/directMesssageRoom.entity";
import { DirectMessage } from "../directMessages/orm/directMessage.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { UserEntity } from "src/users/orm/user.entity";
//import { Injectable } from "@nestjs/common";


//--------------------------------------
type Message = {
    sender: string; // Assuming this is a username or user ID.
    content: string;
    timestamp: Date;
};
type newRoom= {};
@Injectable()
export class DirectMessageService {

  
    constructor( 
        @InjectRepository(DirectMessageRoom)
    private readonly directMessageRoomRepository: Repository<DirectMessageRoom>,
        //@InjectRepository(DirectMessageRoom)
       // @InjectRepository(DirectMessageRoom) 
        //private roomRepository: DirectMessageRoom,
    
    private readonly dmService: DirectMessageService,
    //private readonly dmRoomRepository: Repository<DirectMessageRoom>,
    // Include other injected repositories or services as needed
  ) {}
    
  private rooms: { 
    roomId: number, 
    users: [any, any], // Replacing UserEntity with any for the sake of this example.
    messages: Message[]
}[] = [];  

        private nextRoomId = 1; 
    
        async getRoomWithRelations(id: number) {
            return this.dmService.findOneWithRelations(id); // You're calling the method from the repository, not using createQueryBuilder directly.
        }
        //-------------------------------------------------------------------------------*********
    // async createMessage(user:User, content:string, roomId:number) {
    // return await this.prisma.directMessage.create({
    //     data: {
    //         content: content,
    //         senderId: user.id,
    //         senderPseudo: user.username,
    //         directMessageRoomId: roomId
    //     }
    //     });
    // }

    // async otherUser(user:any, room:any) {
    //     if (user.id === room.ownerOne.id) {
    //         return room.ownerTwoId;
    //     }
    //     if (user.id == room.ownerTwo) {
    //         return room.ownerOne.id;
    //     }
    //     return null
    // }

    // async findRoom(user:User, who:User) {
    //     let room = await this.prisma.directMessageRoom.findFirst({
    //         where: {
    //             ownerOneId : user.id,
    //             ownerTwoId: who.id,
    //         },
    //         select: {
    //             ownerOneId: true,
    //             ownerTwoId: true,
    //             messages: true,
    //             ownerOne: true,
    //             ownerTwo: true,
    //             id: true, 
    //         }
    //     });
    //     if (!room) {
    //         room = await this.prisma.directMessageRoom.findFirst({
    //             where: {
    //                 ownerOneId : who.id,
    //                 ownerTwoId: user.id,
    //             },
    //             select: {
    //                 ownerOneId: true,
    //                 ownerTwoId: true,
    //                 messages: true,
    //                 ownerOne: true,
    //                 ownerTwo: true,
    //                 id: true, 
    //             }
    //         });
    //     }
    //     return room;
    // }

	// async check_blocked(room) {
	// 	const user1 = await this.prisma.user.findUnique({
	// 		where: {id: room.ownerOneId},
	// 		select: {
	// 			id: true,
	// 			userBlocks: true,
  	// 			blockedUserBlocks: true,
	// 		}
	// 	});
	// 	const user2 = await this.prisma.user.findUnique({
	// 		where: {id: room.ownerTwoId},
	// 		select: {
	// 			id: true,
	// 			userBlocks: true,
  	// 			blockedUserBlocks: true,
	// 		}
	// 	});
	// 	for (let i=0; i<user1.userBlocks.length; i++) {
	// 		if (user1.userBlocks[i].blocked_id === user2.id)
	// 			return true;
	// 	}
	// 	for (let i=0; i<user1.blockedUserBlocks.length; i++) {
	// 		if (user1.blockedUserBlocks[i].blocked_id === user2.id)
	// 			return true;
	// 	}
	// 	return false;
	// }
//----------------------------------------------------**********
//-------------------------------------------------------------------------------
async otherUser(user: UserEntity, room: DirectMessageRoom) {
    if (user.id === room.ownerOne.id) {
      return room.ownerTwo.id;
    }
    if (user.id === room.ownerTwo.id) {
      return room.ownerOne.id;
    }
    return null;
  }

  async findRoom(user: UserEntity, who: UserEntity) {
    let room = await this.directMessageRoomRepository.findOne({
      where: [
        { ownerOneId: user.id, ownerTwoId: who.id },
        { ownerOneId: who.id, ownerTwoId: user.id }
      ],
      relations: ['ownerOne', 'ownerTwo', 'messages']
    });
    return room;
  }

  async check_blocked(room: DirectMessageRoom) {
    const user1 = await this.dmService.findOneWithRelations(room.ownerOneId);
    const user2 = await this.dmService.findOneWithRelations(room.ownerTwoId);

    // if (user1.userBlocks.some(block => block.blocked_id === user2.id)) {
    //   return true;
    // }
    // if (user1.blockedUserBlocks.some(block => block.blocked_id === user2.id)) {
    //   return true;
    // }
    return false;
  }

//---------------------------------------------
    //--------------------------------------
    async findRoomsByUserId(userId: number): Promise<DirectMessageRoom[]> {
        try {
          const rooms = await this.directMessageRoomRepository
            .createQueryBuilder("room")
            .where("room.ownerOneId = :userId", { userId })
            .orWhere("room.ownerTwoId = :userId", { userId })
            .leftJoinAndSelect("room.ownerOne", "ownerOne") // Assuming you have a relation set up
            .leftJoinAndSelect("room.ownerTwo", "ownerTwo") // Assuming you have a relation set up
            .getMany();
    
          return rooms;
        } catch (error) {
          throw new NotFoundException('Rooms not found.');
        }
      }
    //--------------------------
   async findRoomBetweenUsers(userA: string, userB: string): Promise< number | null> {
        // Iterate over each room
        for (const room of this.rooms) {
            // Check if both users are in the room
            if (room.users.includes(userA) && room.users.includes(userB)) {
                return room.roomId;  // Return the room ID
            }
        }

        // If no room found between the users
        return null;
    }
    async createRoom(user1: any, user2: any): Promise<{ roomId: number, messages: Message[] }> {
        // Create a new room object with an empty messages array.
        const newRoom: {
            roomId: number;
            users: [any, any];
            messages: Message[];
        } = {
            roomId: this.nextRoomId++,
            users: [user1, user2],
            messages: []
        };

        // Add the new room to the rooms list.
        this.rooms.push(newRoom);

        // Return the new room's details.
        return newRoom;
    }

    //-------------------

    //-----------------
    async findMessages(): Promise<DirectMessageRoom[]> {
        return this.directMessageRoomRepository
          .createQueryBuilder('directMessageRoom')
          .select()
          .getMany();
      }
      
      async findOneWithRelations(id: number): Promise<DirectMessageRoom | undefined> {
          return this.directMessageRoomRepository
              .createQueryBuilder('room')
              .leftJoinAndSelect('room.messages', 'messages')
              .leftJoinAndSelect('room.ownerOne', 'ownerOne')
              .leftJoinAndSelect('room.ownerTwo', 'ownerTwo')
              .where('room.id = :id', { id })
              .getOne();
      }
      
      
      async createMessage(user: UserEntity, content: string, roomId: number): Promise<DirectMessage> {
        const message = new DirectMessage();
        message.content = content;
        message.sender = user.login;  // Assuming the DirectMessage entity has a relation named 'sender' with the User entity
        message.roomId = roomId; // Adjust as necessary if your relations are set up differently
    
        return await this.directMessageRoomRepository.save(message);
      }
    
}                                   