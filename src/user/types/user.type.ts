import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string | null;

  @Field(() => String)
  userName: string;

  @Field(() => String)
  email: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
