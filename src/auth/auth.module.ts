import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/config/prisma.service';

@Module({
  providers: [AuthService, AuthResolver, PrismaService, JwtService],
})
export class AuthModule {}
