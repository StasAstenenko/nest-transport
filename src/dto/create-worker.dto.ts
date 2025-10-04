// src/users/dto/create-worker.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsNumber,
  Min,
  IsIn,
} from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  surname!: string;

  @IsNumber()
  @Min(18)
  age!: number;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsIn(['Адміністратор', 'Водій', 'Диспетчер'])
  role!: string;
}
