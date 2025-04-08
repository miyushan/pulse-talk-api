import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { User, UpdateProfileInput } from './types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Updates the profile of a user.
   * @param userId The ID of the user to update.
   * @param input The updated user data.
   * @returns The updated user.
   */
  async updateUserProfile(
    userId: number,
    input: UpdateProfileInput,
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          userName: input.userName,
        },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  /**
   * Searches for users based on their username.
   * @param userName The username to search for.
   * @param excludedUserId The ID of the user to exclude from the search results.
   * @returns An array of users that match the search criteria.
   */
  async searchUsers(userName: string, excludedUserId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        userName: {
          contains: userName,
          mode: 'insensitive', // case insensitive search
        },
        id: {
          not: excludedUserId,
        },
      },
      take: 10,
    });
  }

  /**
   * Retrieves users associated with a specific chatroom.
   * @param chatRoomId The ID of the chatroom.
   * @returns An array of users associated with the chatroom.
   */
  async getUsersOfChatroom(chatRoomId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        chatRooms: {
          some: {
            id: chatRoomId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Retrieves a user by their ID.
   * @param userId The ID of the user to retrieve.
   * @returns The user object, or null if not found.
   */
  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
