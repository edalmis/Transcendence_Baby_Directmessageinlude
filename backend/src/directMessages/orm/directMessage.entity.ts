import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { DirectMessageRoom } from './directMesssageRoom.entity'; // Importing the DirectMessageRoom entity for the relationship
import { UserEntity} from '../../users/orm/user.entity'; 
@Entity('DirectMessage')  // You can change this name if you have a specific table naming preference
export class DirectMessage {
    
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @Column()
    content: string;
    //-------------------
    @Column()
    sender: string;


    @Column()
    roomId: number;


    //--------

    @Column()
    senderId: number;

    @Column()
    senderPseudo: string;

    @Column()
    directMessageRoomId: number;

    @ManyToOne(() => DirectMessageRoom, dmr => dmr.messages, {
        onDelete: 'CASCADE' // This ensures that when a DirectMessageRoom is deleted, its associated DirectMessages are also deleted.
    })
    @JoinColumn({ name: 'directMessageRoomId' })  // This specifies the column which will be used as the foreign key
    directMessageRoom: DirectMessageRoom;
}
