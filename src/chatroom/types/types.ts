import { Field, ObjectType, ID } from '@nestjs/graphql';
import { User } from 'src/user/types';

@ObjectType()
export class ChatRoom {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => [User], { nullable: true })
  users?: User[];

  @Field(() => [Message], { nullable: true })
  messages?: Message[];
}

@ObjectType()
export class Message {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;

  @Field(() => ChatRoom, { nullable: true })
  chatRoom?: ChatRoom;

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UserTyping {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  chatRoomId?: number;
}

@ObjectType()
export class UserStoppedTyping extends UserTyping {}
