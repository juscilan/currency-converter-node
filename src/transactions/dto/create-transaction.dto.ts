import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user making the transaction',
  })
  @IsNumber()
  @Min(1)
  userId: number;

  @ApiProperty({
    example: 'USD',
    description: 'Currency code to convert from (3 letters)',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  fromCurrency: string;

  @ApiProperty({
    example: 'EUR',
    description: 'Currency code to convert to (3 letters)',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  toCurrency: string;

  @ApiProperty({
    example: 100,
    description: 'Amount to convert',
    minimum: 0.01,
  })
  @IsNumber()
  @Min(0.01)
  fromValue: number;
  
}