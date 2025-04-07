import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../user/types';

@ObjectType()
export class AuthResponse {
  @Field(() => User, { nullable: true })
  user: User | null;

  @Field(() => String, { description: 'Feedback message for the operation' })
  message: string;

  @Field(() => Boolean)
  success: boolean;
}

@ObjectType()
export class RegisterResponse extends AuthResponse {}

@ObjectType()
export class LoginResponse extends AuthResponse {}

@ObjectType()
export class RefreshTokenResponse {
  @Field(() => Boolean)
  success: boolean;
}

@ObjectType()
export class LogoutResponse {
  @Field(() => String)
  message: string;
}
