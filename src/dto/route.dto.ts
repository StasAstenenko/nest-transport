import {
  IsString,
  IsNumber,
  IsArray,
  ValidateNested,
  Min,
  MinLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

// Допоміжний клас для зупинок
class StopDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @IsNumber()
  @Min(1)
  order!: number;
}

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  distance!: number;

  @IsArray()
  @ValidateNested({ each: true }) // Валідувати кожен елемент масиву
  @Type(() => StopDto) // Вказуємо тип для перетворення plain object у клас
  stops!: StopDto[];
}
