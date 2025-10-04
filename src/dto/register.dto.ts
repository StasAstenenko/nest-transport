import { IsEmail, IsString, MinLength, IsNumber, Min } from 'class-validator';

export class RegisterDto {
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
}
