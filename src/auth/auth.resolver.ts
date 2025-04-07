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
import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { RefreshTokenGuard } from './guards';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  /**
   * Registers a new user, sets auth cookies.
   * @param registerDto Data for registration
   * @param res Express Response object (to set cookies)
   * @returns Created user
   */
  @Mutation(() => RegisterResponse)
  async registerUser(
    @Args('input') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    const user = await this.authService.registerUser(registerDto, context.res);
    return {
      user,
      message: 'User registered successfully',
      success: true,
    };
  }

  /**
   * Logs in a user, sets auth cookies.
   * @param loginDto Data for login
   * @param res Express Response object (to set cookies)
   * @returns Logged in user
   */
  @Mutation(() => LoginResponse)
  async loginUser(
    @Args('input') loginDto: LoginDto,
    @Context() context: { res: Response },
  ): Promise<LoginResponse> {
    const user = await this.authService.loginUser(loginDto, context.res);
    return { user, message: 'Logged in successfully', success: true };
  }

  /**
   * Refreshes access token, sets auth cookies.
   * @param req Express Request object (to get refresh token from cookies)
   * @param res Express Response object (to set cookies)
   */
  @UseGuards(RefreshTokenGuard)
  @Mutation(() => RefreshTokenResponse)
  async refreshToken(
    @Context() context: { req: Request; res: Response },
  ): Promise<RefreshTokenResponse> {
    await this.authService.refreshToken(context.req, context.res);
    return { success: true };
  }

  /**
   * Logs out a user, clears auth cookies.
   * @param res Express Response object (to clear cookies)
   */
  @Mutation(() => LogoutResponse)
  async logoutUser(
    @Context() context: { res: Response },
  ): Promise<LogoutResponse> {
    await this.authService.logoutUser(context.res);
    return { message: 'Logged out successfully' };
  }
}
