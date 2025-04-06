import { Resolver, Mutation, Query, Context, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './types';
import {
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from './types';
import { Request, Response } from 'express';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('input') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    const user = await this.authService.register(registerDto, context.res);
    return {
      user,
      message: 'User registered successfully',
    };
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('input') loginDto: LoginDto,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    const user = await this.authService.login(loginDto, context.res);
    return { user, message: 'Logged in successfully' };
  }

  @UseGuards(RefreshTokenGuard)
  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<RefreshTokenResponse> {
    await this.authService.refreshToken(context.req, context.res);
    return { success: true };
  }

  @Mutation(() => LogoutResponse)
  async logout(@Context() context: { res: Response }): Promise<LogoutResponse> {
    await this.authService.logout(context.res);
    return { message: 'Logged out successfully' };
  }
}
