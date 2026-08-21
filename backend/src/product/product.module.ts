import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { BrandModule } from 'src/brand/brand.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [BrandModule, CategoryModule],
})
export class ProductModule {}
