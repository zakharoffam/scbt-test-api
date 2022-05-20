import { IsBoolean, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @Length(1, 255)
  id: string;

  @IsOptional()
  @IsString()
  @Length(1, 255, {
    message: 'Название категории должно быть от 1 до 255 символов.',
  })
  name?: string | undefined;

  @IsOptional()
  @IsString()
  @Min(1, { message: 'Описание должно состоять минимум из 10 символов.' })
  description?: string | undefined;

  @IsOptional()
  @IsBoolean()
  active?: boolean | undefined;
}
