import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class UserResolver {
  @Query(() => String)
  sayHello() {
    return 'hello';
  }
}
