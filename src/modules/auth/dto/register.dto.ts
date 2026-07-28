import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsEmail, IsString, Length } from 'class-validator';

export class AuthCredentialsDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(({ value }: TransformFnParams) => {
    const input: unknown = value;

    return typeof input === 'string' ? input.trim().toLowerCase() : input;
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 12, maxLength: 128 })
  @IsString()
  @Length(12, 128)
  password!: string;
}

export class RegisterDto extends AuthCredentialsDto {}

export class LoginDto extends AuthCredentialsDto {}
