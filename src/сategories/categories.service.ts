import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCategoryDto } from './create-category.dto';
import { CategoryModel } from './category.model';
import { CategoryEntity } from '../storage/entities/category.entity';

@Injectable()
export class CategoriesService {
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
    categoryEntity.slug = dto.name; // TODO: Реализовать транскрипцию названия
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
}
