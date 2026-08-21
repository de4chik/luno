import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Gender } from 'generated/prisma/enums';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsString()
  description!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  price!: number;

  @ApiProperty()
  @IsUUID()
  brandId!: string;

  @ApiProperty()
  @IsUUID()
  categoryId!: string;

  @ApiProperty()
  @IsEnum(Gender, { message: 'Gender must be MAN | WOMAN | KIDS' })
  gender!: Gender;

  @ApiProperty()
  @IsString()
  color!: string;

  @ApiProperty()
  @IsString()
  sku!: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: true,
  })
  images!: Express.Multer.File[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
