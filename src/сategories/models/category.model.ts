import { CategoryEntity } from '../../storage/entities/category.entity';

export class CategoryModel {
  id: string;
  createdDate: Date;
  slug: string;
  name: string;
  description: string | null;
  active: boolean;

  /**
   * Создать модель категории из сущности
   * @param entity
   */
  static create(entity: CategoryEntity): CategoryModel {
    const model = new CategoryModel();
    model.id = entity.id;
    model.createdDate = entity.createdDate;
    model.slug = entity.slug;
    model.name = entity.name;
    model.description = entity.description;
    model.active = entity.active;
    return model;
  }
}
