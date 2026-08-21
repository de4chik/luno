import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty()
  @IsString({ message: 'Brand name is string' })
  name!: string;

  @ApiProperty()
  @IsString({ message: 'Brand description is string' })
  logotype!: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
