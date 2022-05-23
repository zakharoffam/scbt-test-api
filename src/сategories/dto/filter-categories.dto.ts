import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class FilterCategoriesDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string | undefined;

  @IsOptional()
  @IsString()
  @MinLength(1)
  description?: string | undefined;

  @IsOptional()
  @IsIn(['0', 'false', '1', 'true'])
  active?: '0' | 'false' | '1' | 'true' | undefined;

  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string | undefined;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(9)
  pageSize?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsIn([
    'id',
    '-id',
    'createdDate',
    '-createdDate',
    'slug',
    '-slug',
    'name',
    '-name',
    'description',
    '-description',
    'active',
    '-active',
  ])
  sort?:
    | 'id'
    | '-id'
    | 'createdDate'
    | '-createdDate'
    | 'slug'
    | '-slug'
    | 'name'
    | '-name'
    | 'description'
    | '-description'
    | 'active'
    | '-active'
    | undefined;
}
