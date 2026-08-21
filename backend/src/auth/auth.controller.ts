import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { LoginUserDto } from './dto/auth.dto';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    return this.authService.register(createUserDto, res);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.authService.login(loginUserDto, res);
  }

  @Get('refresh')
  refresh(@Req() req: Request, @Res() res: Response) {
    return this.authService.refresh(req, res);
  }
}
