import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString({ message: 'Category name is string' })
  name!: string;

  @ApiProperty()
  @IsString({ message: 'Category description is string' })
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
