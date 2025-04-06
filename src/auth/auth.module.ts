import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/config/prisma.service';

@Module({
  providers: [
    AuthService,
    AuthResolver,
    PrismaService,
    ConfigService,
    JwtService,
  ],
})
export class AuthModule {}
