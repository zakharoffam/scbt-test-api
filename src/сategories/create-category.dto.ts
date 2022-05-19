import { IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 255, {
    message: 'Длина названия должна быть от 1 до 255 символов.',
  })
  name: string;

  @IsOptional()
  @IsString()
  @Min(1)
  description?: string;
}
