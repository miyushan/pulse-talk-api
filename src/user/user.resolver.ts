import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UpdateProfileInput, SearchUsersInput } from './types';
import { RequestWithUser } from 'src/types';
import { AccessTokenGuard } from 'src/auth/guards';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async updateProfile(
    @Args('input') input: UpdateProfileInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const userId = context.req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.userService.updateProfile(userId, input);
  }

  @UseGuards(AccessTokenGuard)
  @Query(() => [User], { name: 'searchUsers' })
  async searchUsers(
    @Args('input') input: SearchUsersInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const userId = context.req.user?.sub;
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.userService.searchUsers(input.userName, userId);
  }

  @Query(() => [User], { name: 'usersOfChatroom' })
  async getUsersOfChatroom(@Args('chatRoomId') chatRoomId: number) {
    return this.userService.getUsersOfChatroom(chatRoomId);
  }
}
