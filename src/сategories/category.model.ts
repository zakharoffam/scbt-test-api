import { CategoryEntity } from '../storage/entities/category.entity';

export class CategoryModel {
  id: string;
  createdDate: Date;
  slug: string;
  name: string;
  description: string | null;
  active: boolean;

  // TODO: Реализовать метод
  static getModel(entity: CategoryEntity): CategoryModel {
    return new CategoryModel();
  }
}
