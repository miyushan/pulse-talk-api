import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async extractTokenFromConnectionParams(
    connectionParams: Record<string, unknown> | undefined,
  ): Promise<string | null> {
    return (connectionParams?.access_token as string) || null;
  }

  async validateToken(token: string): Promise<any> {
    const accessTokenSecret =
      this.configService.get<string>('JWT_ACCESS_SECRET');
    try {
      return await this.jwtService.verifyAsync(token, {
        secret: accessTokenSecret,
      });
    } catch (error) {
      return null;
    }
  }
}
