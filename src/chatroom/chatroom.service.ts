import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';

@Injectable()
export class ChatroomService {
  constructor(private readonly prisma: PrismaService) {}

  async getChatroom(id: string) {
    return this.prisma.chatRoom.findUnique({
      where: {
        id: parseInt(id),
      },
    });
  }

  async createChatroom(name: string, sub: number) {
    const existingChatroom = await this.prisma.chatRoom.findFirst({
      where: {
        name,
      },
    });
    if (existingChatroom) {
      throw new BadRequestException({ name: 'Chatroom already exists' });
    }
    return this.prisma.chatRoom.create({
      data: {
        name,
        users: {
          connect: {
            id: sub, // Connect the current user
          },
        },
      },
    });
  }

  async addUsersToChatroom(chatRoomId: number, userIds: number[]) {
    const existingChatroom = await this.prisma.chatRoom.findUnique({
      where: {
        id: chatRoomId,
      },
    });
    if (!existingChatroom) {
      throw new BadRequestException({ chatRoomId: 'Chatroom not found' });
    }

    return await this.prisma.chatRoom.update({
      where: {
        id: chatRoomId,
      },
      data: {
        users: {
          connect: userIds.map((id) => ({ id: id })),
        },
      },
      include: {
        users: true, // return all users
      },
    });
  }

  async getChatRoomsForUser(userId: number) {
    return this.prisma.chatRoom.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          orderBy: {
            createdAt: 'desc',
          },
        }, // return all users

        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async sendMessage(chatRoomId: number, message: string, userId: number) {
    return await this.prisma.message.create({
      data: {
        content: message,
        chatRoomId,
        userId,
      },
      include: {
        chatRoom: {
          include: {
            users: true,
          },
        },
        user: true,
      },
    });
  }

  async getMessagesForChatroom(chatRoomId: number) {
    return await this.prisma.message.findMany({
      where: {
        chatRoomId: chatRoomId,
      },
      include: {
        chatRoom: {
          include: {
            users: {
              orderBy: {
                createdAt: 'asc',
              },
            },
          },
        },
        user: true,
      },
    });
  }

  async deleteChatroom(chatRoomId: number) {
    return this.prisma.chatRoom.delete({
      where: {
        id: chatRoomId,
      },
    });
  }
}
