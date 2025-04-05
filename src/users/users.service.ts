import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async create(createUserDto: Prisma.UserCreateInput) {
    return this.dbService.user.create({
      data: createUserDto,
    });
  }

  async findAll(role?: 'INTERN' | 'ENGINEER' | 'ADMIN') {
    if (role) {
      return this.dbService.user.findMany({
        where: {
          role,
        },
      });
    }
    return this.dbService.user.findMany();
  }

  async findOne(id: number) {
    return this.dbService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    return this.dbService.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return this.dbService.user.delete({
      where: {
        id,
      },
    });
  }
}
