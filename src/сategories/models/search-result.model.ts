import { CategoryModel } from './category.model';

export class SearchResultModel {
  count: number;
  page: number;
  result: CategoryModel[];

  constructor(count: number, page: number, result: CategoryModel[]) {
    this.count = count;
    this.page = page;
    this.result = result;
  }
}
