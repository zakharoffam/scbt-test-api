import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import cyrillicToTranslit from 'cyrillic-to-translit-js';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryModel } from './category.model';
import { CategoryEntity } from '../storage/entities/category.entity';
import { UpdateCategoryDto } from './update-category.dto';
import { FilterCategoriesDto } from './filter-categories.dto';

@Injectable()
export class CategoriesService {
  /**
   * Генерация уникального SLUG-имени
   * @param name
   * @private
   */
  private static generateSlug(name: string): string {
    return cyrillicToTranslit().transform(name, '_');
  }

  /**
   * Найти категорию по ID
   * @param id
   */
  public async findCategoryById(id: string): Promise<CategoryModel> {
    const entity = await CategoryEntity.findOne({ where: { id: id } });
    if (!entity) {
      throw new NotFoundException(`Категория с ID ${id} не найдена.`);
    }
    return CategoryModel.getModel(entity);
  }

  /**
   * Найти категорию по SLUG
   * @param slug
   */
  public async findCategoryBySlug(slug: string): Promise<CategoryModel> {
    const entity = await CategoryEntity.findOne({ where: { slug: slug } });
    if (!entity) {
      throw new NotFoundException(
        `Категория с уникальным именем "${slug}" не найдена.`,
      );
    }
    return CategoryModel.getModel(entity);
  }

  /**
   * Найти категории по фильтру
   */
  public async findCategoriesByFilter(
    filter?: FilterCategoriesDto,
  ): Promise<CategoryModel[]> {
    if (!filter) {
      const find = await CategoryEntity.find({
        take: 2,
        order: { createdDate: 'DESC' },
      });
      return find.map((category) => CategoryModel.getModel(category));
    } else {
      return [];
    }
  }

  /**
   * Добавить категорию
   * @param dto
   */
  public async addCategory(dto: CreateCategoryDto): Promise<CategoryModel> {
    const isExist = await CategoryEntity.findOne({
      where: { name: dto.name },
    });
    if (isExist) {
      throw new BadRequestException(
        `Категория с названием "${dto.name}" уже существует.`,
      );
    }
    let categoryEntity = new CategoryEntity();
    categoryEntity.slug = CategoriesService.generateSlug(dto.name);
    categoryEntity.name = dto.name;
    categoryEntity.description = dto.description;
    categoryEntity.active = true;
    try {
      categoryEntity = await CategoryEntity.save(categoryEntity);
    } catch (err) {
      Logger.error(err, `CategoriesService.addCategory()`);
      throw new InternalServerErrorException(`Внутренняя ошибка сервера.`);
    }
    return CategoryModel.getModel(categoryEntity);
  }

  /**
   * Обновить данные категории
   * @param data
   */
  public async updateCategory(data: UpdateCategoryDto): Promise<CategoryModel> {
    let entity = await CategoryEntity.findOne({ where: { id: data.id } });
    if (!entity) {
      throw new BadRequestException(`Категории с ID ${data.id} не существует.`);
    }
    if (data.name) {
      const isExistWithNewName = await CategoryEntity.findOne({
        where: { name: data.name },
      });
      if (isExistWithNewName) {
        throw new BadRequestException(
          `Категория с названием "${data.name}" уже существует.`,
        );
      }
      entity.name = data.name;
      entity.slug = CategoriesService.generateSlug(data.name);
    }
    if (data.description) {
      entity.description = data.description;
    }
    if (data.active !== undefined) {
      entity.active = data.active;
    }
    try {
      entity = await CategoryEntity.save(entity);
    } catch (err) {
      Logger.error(err, `CategoriesService.updateCategory()`);
      throw new InternalServerErrorException(`Внутренняя ошибка сервера.`);
    }
    return CategoryModel.getModel(entity);
  }

  /**
   * Удалить категорию
   * @param id
   */
  public async removeCategory(id: string): Promise<string> {
    const entity = await CategoryEntity.findOne({ where: { id: id } });
    if (!entity) {
      throw new BadRequestException(`Категории с ID ${id} не существует.`);
    }
    try {
      await CategoryEntity.remove(entity);
    } catch (err) {
      Logger.error(err, `CategoriesService.updateCategory()`);
      throw new InternalServerErrorException(`Внутренняя ошибка сервера.`);
    }
    return `Категория "${entity.name}" успешно удалена.`;
  }
}
