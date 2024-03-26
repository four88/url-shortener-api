import { IsNotEmpty, IsOptional, IsUrl, IsString } from 'class-validator';
export class CreateUrlDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  redirect: string;
}
