import { Injectable } from '@nestjs/common';
import { FilterCategoriesDto } from './dto/filter-categories.dto';
import { CategoryModel } from './models/category.model';
import { CategoryEntity } from '../storage/entities/category.entity';
import { FindManyOptions, Like } from 'typeorm';
import { SearchResultModel } from './models/search-result.model';

@Injectable()
export class FilterForCategoriesService {
  /**
   * Найти категории по фильтру
   */
  public async findCategoriesByFilter(
    filter: FilterCategoriesDto,
  ): Promise<SearchResultModel> {
    let name: string;
    let description: string;
    let active: boolean;
    let search: string;
    let pageSize = 2;
    let page;
    let sort;

    if (filter.name) {
      name = filter.name
        .toLocaleLowerCase()
        .replace(/ё/g, 'е')
        .replace(/ +/g, '%'); // Чтобы "хорошо" работал LIKE в SQL-запросе
    }

    if (filter.description) {
      description = filter.description
        .toLocaleLowerCase()
        .replace(/ё/g, 'е')
        .replace(/ +/g, '%');
    }

    switch (filter.active) {
      case '0':
        active = false;
        break;
      case 'false':
        active = false;
        break;
      case '1':
        active = true;
        break;
      case 'true':
        active = true;
        break;
      default:
        active = true;
    }

    if (filter.pageSize) {
      pageSize = Number(filter.pageSize);
    }

    if (filter.search) {
      search = filter.search
        .toLocaleLowerCase()
        .replace(/ё/g, 'е')
        .replace(/ +/g, '%');
    }

    if (filter.page) {
      if (Number(filter.page) === 0 || Number(filter.page) === 1) {
        page = 0;
      } else {
        page = Number(filter.page);
      }
    }

    switch (filter.sort) {
      case 'id':
        sort = { id: 'ASC' };
        break;
      case '-id':
        sort = { id: 'DESC' };
        break;
      case 'createdDate':
        sort = { createdDate: 'ASC' };
        break;
      case '-createdDate':
        sort = { createdDate: 'DESC' };
        break;
      case 'slug':
        sort = { slug: 'ASC' };
        break;
      case '-slug':
        sort = { slug: 'DESC' };
        break;
      case 'name':
        sort = { name: 'ASC' };
        break;
      case '-name':
        sort = { name: 'DESC' };
        break;
      case 'description':
        sort = { description: 'ASC' };
        break;
      case '-description':
        sort = { description: 'DESC' };
        break;
      case 'active':
        sort = { active: 'ASC' };
        break;
      case '-active':
        sort = { active: 'DESC' };
        break;
      default:
        sort = { createdDate: 'DESC' };
        break;
    }

    const findManyOptions: FindManyOptions = {
      where: { active: active },
      take: pageSize,
      order: sort,
    };

    if (search) {
      findManyOptions.where.searchNameAndDescription = Like(`%${search}%`);
    } else {
      if (name) {
        findManyOptions.where.searchName = Like(`%${name}%`);
      }
      if (description) {
        findManyOptions.where.searchDescription = Like(`%${description}%`);
      }
    }

    if (page && (page !== 0 || page !== 1)) {
      findManyOptions.skip = pageSize * (Number(page) - 1);
    }

    const find = await CategoryEntity.find(findManyOptions);
    return new SearchResultModel(
      find.length,
      page,
      find.map((c) => CategoryModel.create(c)),
    );
  }
}
