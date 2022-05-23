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
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryModel } from './models/category.model';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FilterCategoriesDto } from './dto/filter-categories.dto';
import { FilterForCategoriesService } from './filter-for-categories.service';
import { SearchResultModel } from './models/search-result.model';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly filterForCategories: FilterForCategoriesService,
  ) {}

  /**
   * Получить список категорий фильтру
   * @url GET /api/categories/filter
   * @private
   */
  @Get('filter')
  private async findCategories(
    @Query() query: FilterCategoriesDto,
  ): Promise<SearchResultModel> {
    return await this.filterForCategories.findCategoriesByFilter(query);
  }

  /**
   * Получить категорию по ID или SLUG
   * @url GET /api/categories
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
