import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
    Repository
  } from 'typeorm';
  import { UserEntity } from '../../users/orm/user.entity'; // assuming you have a User entity file named User.entity.ts
  import { DirectMessage } from '../orm/directMessage.entity'; // assuming you'll have a DirectMessage entity
  
  @Entity('direct_message')
  export class DirectMessageRoom {

  

    @PrimaryGeneratedColumn()
    id: number;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @Column()
    ownerOneId: number;
  
    @Column()
    ownerTwoId: number;
  
    //@ManyToOne(() => UserEntity, (user) => user.directMessageRoomsAsOwnerOne, {
     // cascade: true,
    //})
    @JoinColumn({ name: 'ownerOneId' })
    ownerOne: UserEntity;
  
    //@ManyToOne(() => UserEntity, (user) => user.directMessageRoomsAsOwnerTwo, {
    //  cascade: true,
    //})
    @JoinColumn({ name: 'ownerTwoId' })
    ownerTwo: UserEntity;
  
    @OneToMany(() => DirectMessage, (message) => message.directMessageRoom, {
      cascade: true,
    })
    messages: DirectMessage[];

    //----------------------------
    // @ManyToOne(() => UserEntity, (user) => user.directMessageRoomsAsOwnerOne)
    // ownerOne: UserEntity;

    // @ManyToOne(() => UserEntity, (user) => user.directMessageRoomsAsOwnerTwo)
    // ownerTwo: UserEntity;
    //---------------------------------

    //-----------------------------------------
    // @OneToMany(() => UserEntity, (entity) => entity.ownerOne)
    // directMessageRoomsAsOwnerOne: UserEntity[];

    // @OneToMany(() => UserEntity, (entity) => entity.ownerTwo)
    // directMessageRoomsAsOwnerTwo: UserEntity[];

    //----------------------------------------
    name: string;

// Method to set name based on user ID
    setNameForUser(userId: number): void {
    if (this.ownerOne && this.ownerTwo) {
    this.name = (userId === this.ownerOne.id) ? this.ownerTwo.userName : this.ownerOne.userName;
    }
}   
//---------------

}
