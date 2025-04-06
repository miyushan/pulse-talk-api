import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from 'src/config/prisma.service';

@Module({
  providers: [UserService, UserResolver, PrismaService],
})
export class UserModule {}
