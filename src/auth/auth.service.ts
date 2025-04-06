import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { PrismaService } from '../config/prisma.service';
import { LoginDto, RegisterDto } from './types';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';
import { Environment } from 'src/constants';
import { AuthTimeConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Registers a new user, sets auth cookies.
   * @param registerDto Data for registration
   * @param res Express Response object (to set cookies)
   * @returns Created user
   */
  async registerUser(registerDto: RegisterDto, res: Response): Promise<User> {
    // Check if user exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: registerDto.email }, { userName: registerDto.userName }],
      },
    });
    if (existingUser) {
      throw new BadRequestException(
        existingUser.email === registerDto.email
          ? 'Email already in use'
          : 'Username already taken',
      );
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        userName: registerDto.userName,
        password: hashedPassword,
        email: registerDto.email,
      },
    });

    await this.setAuthCookies(user, res);
    return user;
  }

  /**
   * Logs in a user, sets auth cookies.
   * @param loginDto Data for login
   * @param res Express Response object (to set cookies)
   * @returns Logged in user
   */
  async loginUser(loginDto: LoginDto, res: Response): Promise<User> {
    // Validate credentials
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.setAuthCookies(user, res);
    return user;
  }

  /**
   * Refreshes access token, sets auth cookies.
   * @param req Express Request object (to get refresh token from cookies)
   * @param res Express Response object (to set cookies)
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    // Verify refresh token
    const refreshToken = req.cookies?.[REFRESH_TOKEN];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload;
    try {
      payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Generate new access token
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    await this.setAuthCookies(user, res);
  }

  /**
   * Logs out a user, clears auth cookies.
   * @param res Express Response object (to clear cookies)
   */
  async logoutUser(res: Response): Promise<void> {
    res.clearCookie(ACCESS_TOKEN);
    res.clearCookie(REFRESH_TOKEN);
  }

  /**
   * Generates access and refresh tokens for a user.
   * @param user User object
   * @returns Object containing access and refresh tokens
   */
  private async generateTokens(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = { sub: user.id, email: user.email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
        expiresIn: AuthTimeConstants.ACCESS_TOKEN.EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: AuthTimeConstants.REFRESH_TOKEN.EXPIRES_IN,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * Sets auth cookies for a user.
   * @param user User object
   * @param res Express Response object (to set cookies)
   */
  private async setAuthCookies(user: User, res: Response): Promise<void> {
    const tokens = await this.generateTokens(user);
    const { accessToken, refreshToken } = tokens;

    const isProduction =
      this.configService.get('NODE_ENV') === Environment.PROD;

    res.cookie(ACCESS_TOKEN, accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: AuthTimeConstants.ACCESS_TOKEN.COOKIE_MAX_AGE,
    });

    res.cookie(REFRESH_TOKEN, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: AuthTimeConstants.REFRESH_TOKEN.COOKIE_MAX_AGE,
    });
  }
}
