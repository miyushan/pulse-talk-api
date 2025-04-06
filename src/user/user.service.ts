import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { User, UpdateProfileInput } from './types';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(
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

  async getUsersOfChatroom(chatroomId: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        chatRooms: {
          some: {
            id: chatroomId,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
}
