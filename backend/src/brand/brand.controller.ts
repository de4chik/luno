import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/brand.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('create')
  createBrand(@Body() BrandDto: CreateBrandDto) {
    return this.brandService.create(BrandDto);
  }

  @Get('all')
  getAllCategories() {
    return this.brandService.getAll();
  }

  @Get('by-id/:id')
  getBrandById(@Param('id') BrandId: string) {
    return this.brandService.getById(BrandId);
  }

  @Get('by-name/:name')
  getBrandByName(@Param('name') nameBrand: string) {
    return this.brandService.getByName(nameBrand);
  }
}
