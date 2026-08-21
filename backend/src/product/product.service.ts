import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { Gender } from 'generated/prisma/enums';
import { CategoryService } from 'src/category/category.service';
import { BrandService } from 'src/brand/brand.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}

  async create(productDto: CreateProductDto, images: Express.Multer.File[]) {
    const { gender } = productDto;
    if (!Object.values(Gender).includes(gender)) {
      throw new BadRequestException('Invalid gender');
    }

    await this.categoryService.getById(productDto.categoryId);
    await this.brandService.getById(productDto.brandId);

    const imageUrls = images.map(
      (item) => `${process.env.UPLOAD_URL}/${item.filename}`,
    );

    return await this.prisma.product.create({
      data: { ...productDto, images: imageUrls },
    });
  }

  async getAll() {
    return await this.prisma.product.findMany();
  }

  async getById(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getBySku(productSku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku: productSku },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async getByCategoryId(categoryId: string) {
    await this.categoryService.getById(categoryId);
    const products = await this.prisma.product.findMany({
      where: { categoryId },
    });
    if (!products) {
      throw new NotFoundException('Products not found');
    }
    return products;
  }

  async getByBrandId(brandId: string) {
    await this.brandService.getById(brandId);
    const products = await this.prisma.product.findMany({ where: { brandId } });
    if (!products) {
      throw new NotFoundException('Products not found');
    }
    return products;
  }

  async searchProduct(search: string) {
    const product = await this.prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            sku: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
    });
    return product;
  }
}
