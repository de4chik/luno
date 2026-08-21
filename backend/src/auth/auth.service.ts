import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { TokensService } from 'src/tokens/tokens.service';
import { LoginUserDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokensService: TokensService,
    private readonly prisma: PrismaService,
  ) {}

  async register(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userService.getByEmail(createUserDto.email);
    if (user) {
      throw new ForbiddenException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashedPassword,
    });
    const tokens = this.tokensService.generateTokens(newUser.id);
    // await this.prisma.tokens.create({
    //   data: {
    //     accessToken: tokens.accessToken,
    //     refreshToken: tokens.refreshToken,
    //     user: {
    //       connect: {
    //         id: newUser.id,
    //       },
    //     },
    //   },
    // });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ user: newUser, accessToken: tokens.accessToken });
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const user = await this.userService.getByEmail(loginUserDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }
    const tokens = this.tokensService.generateTokens(user.id);
    // await this.prisma.tokens.create({
    //   data: {
    //     accessToken: tokens.accessToken,
    //     refreshToken: tokens.refreshToken,
    //     user: {
    //       connect: {
    //         id: user.id,
    //       },
    //     },
    //   },
    // });
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({ user, accessToken: tokens.accessToken });
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.headers.cookie
      ?.split('; ')
      .find((cookie) => cookie.startsWith('refreshToken='))
      ?.split('=')[1];
    if (!refreshToken) {
      throw new BadRequestException('Refresh token not found');
    }
    const decoded = this.tokensService.verifyToken(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
    const user = await this.userService.getById(decoded.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const tokens = this.tokensService.generateTokens(user.id);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json(user);
  }
}
