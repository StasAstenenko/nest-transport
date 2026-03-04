import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTransportDto {
  @IsString()
  @MinLength(3)
  type!: string; // Наприклад: Автобус, Трамвай

  @IsString()
  @MinLength(2)
  number!: string; // Номерний знак або бортовий номер

  @IsNumber()
  @Min(1)
  capacity!: number;

  @IsString()
  @IsOptional()
  condition?: string; // Стан (Новий, В ремонті тощо)
}
