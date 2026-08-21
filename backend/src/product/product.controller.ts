import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ApiBody, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateProductDto,
  })
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const filename = `${randomUUID()}${extname(file.originalname)}`;

          cb(null, filename);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only images are allowed'), false);
        }

        cb(null, true);
      },
    }),
  )
  async createProduct(
    @Body() productDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productService.create(productDto, images);
  }

  @Get('all')
  getAllProducts() {
    return this.productService.getAll();
  }

  @Get('by-id/:id')
  getProductById(@Param('id') productId: string) {
    return this.productService.getById(productId);
  }

  @Get('by-sku/:sku')
  getProductBySku(@Param('sku') productSku: string) {
    return this.productService.getBySku(productSku);
  }

  @Get('by-category-id/:categoryId')
  getProductsByCategoryId(@Param('categoryId') categoryId: string) {
    return this.productService.getByCategoryId(categoryId);
  }

  @Get('by-brand-id/:brandId')
  getProductsByBrandId(@Param('brandId') brandId: string) {
    return this.productService.getByBrandId(brandId);
  }

  @Get('search')
  getProductSearch(@Query('search') search: string) {
    return this.productService.searchProduct(search)
  }
}
