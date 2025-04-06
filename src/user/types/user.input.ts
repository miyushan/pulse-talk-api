import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateProfileInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  userName: string;
}

@InputType()
export class SearchUsersInput {
  @Field()
  userName: string;
}
