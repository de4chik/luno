import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(categoryDto: CreateCategoryDto) {
    return await this.prisma.category.create({ data: categoryDto });
  }

  async getAll() {
    return await this.prisma.category.findMany();
  }

  async getById(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return category;
  }

  async getByName(nameCategory: string) {
    const category = await this.prisma.category.findUnique({
      where: { name: nameCategory },
    });
    if (!category) {
      throw new NotFoundException('category not found');
    }
    return category;
  }
}
