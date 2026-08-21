import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: userDto,
    });
  }
  async getAll() {
    return await this.prisma.user.findMany();
  }
  async getById(id: string) {
    return await this.prisma.user.findUnique({ where: { id } });
  }
  async getByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { tokens: true },
    });
  }
}
