import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryModel } from './category.model';
import { UpdateCategoryDto } from './update-category.dto';
import { FilterCategoriesDto } from './filter-categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  /**
   * Получить категорию
   * @param id
   * @param slug
   * @private
   */
  @Get()
  private async getCategory(
    @Query('id') id: string,
    @Query('slug') slug: string,
  ): Promise<CategoryModel | NotFoundException> {
    if (id !== undefined) {
      return await this.categoriesService.findCategoryById(id);
    } else if (slug !== undefined) {
      return await this.categoriesService.findCategoryBySlug(slug);
    } else {
      throw new BadRequestException(
        'Не передано ни одного параметра для поиска категории.',
      );
    }
  }

  /**
   * Получить список категорий фильтру
   * @url POST /api/categories/search
   * @private
   */
  @Post('search')
  private async findCategories(
    @Body() body?: FilterCategoriesDto,
  ): Promise<CategoryModel[]> {
    return await this.categoriesService.findCategoriesByFilter(body);
  }

  /**
   * Создать новую категорию
   * @url POST /api/categories
   * @private
   */
  @Post()
  private async postCategory(
    @Body() body: CreateCategoryDto,
  ): Promise<
    CategoryModel | BadRequestException | InternalServerErrorException
  > {
    return await this.categoriesService.addCategory(body);
  }

  /**
   * Обновить данные категории
   * @url PUT /api/categories
   * @private
   */
  @Post()
  private async putCategory(
    @Body() body: UpdateCategoryDto,
  ): Promise<
    CategoryModel | BadRequestException | InternalServerErrorException
  > {
    return await this.categoriesService.updateCategory(body);
  }

  /**
   * Удалить категорию по ID
   * @url DELETE /api/categories/:id
   * @param id
   * @private
   */
  @Delete(':id')
  private async deleteCategory(
    @Param('id') id: string,
  ): Promise<string | BadRequestException | InternalServerErrorException> {
    return await this.categoriesService.removeCategory(id);
  }
}
