import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique transaction identifier' })
  transactionId: number;

  @Column()
  @ApiProperty({ example: 1, description: 'User ID who made the transaction' })
  userId: number;

  @Column({ length: 3 })
  @ApiProperty({ example: 'USD', description: 'Source currency code' })
  fromCurrency: string;

  @Column({ length: 3 })
  @ApiProperty({ example: 'EUR', description: 'Target currency code' })
  toCurrency: string;

  @Column('decimal', { precision: 18, scale: 4 })
  @ApiProperty({ example: 100, description: 'Amount in source currency' })
  fromValue: number;

  @Column('decimal', { precision: 18, scale: 4 })
  @ApiProperty({ example: 85, description: 'Converted amount in target currency' })
  toValue: number;

  @Column('decimal', { precision: 18, scale: 6 })
  @ApiProperty({ example: 0.85, description: 'Exchange rate used' })
  rate: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  @ApiProperty({ example: '2023-05-20T12:00:00Z', description: 'Transaction timestamp' })
  timestamp: Date;

  
}