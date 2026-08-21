import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(private readonly jwtService: JwtService) {}

  generateTokens(userId: string) {
    const accessToken = this.jwtService.sign(
      { userId },
      { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET },
    );
    const refreshToken = this.jwtService.sign(
      { userId },
      { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET },
    );
    return { accessToken, refreshToken };
  }

  verifyToken(token: string, options: JwtVerifyOptions) {
    return this.jwtService.verify(token, options);
  }
}
