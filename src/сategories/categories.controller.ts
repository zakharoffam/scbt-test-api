import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryModel } from './category.model';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Создать новую категорию
   * @method POST
   * @url /api/categories
   * @private
   */
  @Post()
  private async getCategories(
    @Body() body: CreateCategoryDto,
  ): Promise<
    CategoryModel | BadRequestException | InternalServerErrorException
  > {
    return await this.categoriesService.addCategory(body);
  }
}
