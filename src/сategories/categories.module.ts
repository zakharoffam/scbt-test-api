import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { FilterForCategoriesService } from './filter-for-categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, FilterForCategoriesService],
})
export class CategoriesModule {}
