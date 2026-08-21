import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly prisma: PrismaService) {}

  async create(brandDto: CreateBrandDto) {
    return await this.prisma.brand.create({ data: brandDto });
  }

  async getAll() {
    return await this.prisma.brand.findMany();
  }

  async getById(brandId: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id: brandId },
    });
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return brand;
  }

  async getByName(namebrand: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { name: namebrand },
    });
    if (!brand) {
      throw new NotFoundException('brand not found');
    }
    return brand;
  }
}
