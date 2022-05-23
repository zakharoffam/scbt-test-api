import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { transliterate } from 'transliteration';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryModel } from './models/category.model';
import { CategoryEntity } from '../storage/entities/category.entity';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  /**
   * Генерация уникального SLUG-имени
   * @static
   * @param name
   * @private
   */
  private static generateSlug(name: string): string {
    return transliterate(name);
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
    return CategoryModel.create(entity);
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
    return CategoryModel.create(entity);
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
    let entity = new CategoryEntity();
    entity.slug = CategoriesService.generateSlug(dto.name);
    entity.name = dto.name;
    entity.description = dto.description || '';
    entity.active = true;
    entity.searchName = dto.name.toLocaleLowerCase().replace('ё', 'е');
    entity.searchDescription = dto.description
      ? dto.description.toLocaleLowerCase().replace(/ё/g, 'е')
      : '';
    entity.searchNameAndDescription =
      entity.searchName + ' ' + entity.searchDescription;
    try {
      entity = await CategoryEntity.save(entity);
    } catch (err) {
      Logger.error(err, `CategoriesService.addCategory()`);
      throw new InternalServerErrorException(`Внутренняя ошибка сервера.`);
    }
    return CategoryModel.create(entity);
  }

  /**
   * Обновить данные категории
   * @param dto
   */
  public async updateCategory(dto: UpdateCategoryDto): Promise<CategoryModel> {
    let entity = await CategoryEntity.findOne({ where: { id: dto.id } });
    if (!entity) {
      throw new BadRequestException(`Категории с ID ${dto.id} не существует.`);
    }
    if (dto.name) {
      const isExistWithNewName = await CategoryEntity.findOne({
        where: { name: dto.name },
      });
      if (isExistWithNewName) {
        throw new BadRequestException(
          `Категория с названием "${dto.name}" уже существует.`,
        );
      }
      entity.name = dto.name;
      entity.slug = CategoriesService.generateSlug(dto.name);
      entity.searchName = dto.name.toLocaleLowerCase().replace('ё', 'е');
    }
    if (dto.description) {
      entity.description = dto.description;
      entity.searchDescription = dto.description
        ? dto.description.toLocaleLowerCase().replace(/ё/g, 'е')
        : '';
    }
    entity.searchNameAndDescription =
      entity.searchName + ' ' + entity.searchDescription;
    if (dto.active !== undefined) {
      entity.active = dto.active;
    }
    try {
      entity = await CategoryEntity.save(entity);
    } catch (err) {
      Logger.error(err, `CategoriesService.updateCategory()`);
      throw new InternalServerErrorException(`Внутренняя ошибка сервера.`);
    }
    return CategoryModel.create(entity);
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
