import { IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 255, {
    message: 'Название должно быть от 1 до 255 символов.',
  })
  name: string;

  @IsOptional()
  @IsString()
  description?: string | undefined;
}
