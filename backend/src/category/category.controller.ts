import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  createCategory(@Body() categoryDto: CreateCategoryDto) {
    return this.categoryService.create(categoryDto);
  }

  @Get('all')
  getAllCategories() {
    return this.categoryService.getAll();
  }

  @Get('by-id/:id')
  getCategoryById(@Param('id') categoryId: string) {
    return this.categoryService.getById(categoryId);
  }

  @Get('by-name/:name')
  getCategoryByName(@Param('name') nameCategory: string) {
    return this.categoryService.getByName(nameCategory);
  }
}
