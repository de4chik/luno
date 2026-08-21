import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { BrandModule } from './brand/brand.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TokensModule } from './tokens/tokens.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    UserModule,
    AuthModule,
    TokensModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
