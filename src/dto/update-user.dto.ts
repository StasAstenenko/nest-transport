import {
  IsEmail,
  IsString,
  MinLength,
  IsNumber,
  Min,
  IsIn,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  surname?: string;

  @IsOptional()
  @IsNumber()
  @Min(18)
  age?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['Адміністратор', 'Водій', 'Диспетчер'])
  role?: string;
}
