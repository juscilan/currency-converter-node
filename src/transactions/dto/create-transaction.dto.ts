import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(1)
  userId: number;

  @IsString()
  @Length(3, 3)
  fromCurrency: string;

  @IsString()
  @Length(3, 3)
  toCurrency: string;

  @IsNumber()
  @Min(0.01)
  fromValue: number;
  
}