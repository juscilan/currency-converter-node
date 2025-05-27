import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transactionId: number;

  @Column()
  userId: number;

  @Column({ length: 3 })
  fromCurrency: string;

  @Column({ length: 3 })
  toCurrency: string;

  @Column('decimal', { precision: 18, scale: 4 })
  fromValue: number;

  @Column('decimal', { precision: 18, scale: 4 })
  toValue: number;

  @Column('decimal', { precision: 18, scale: 6 })
  rate: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  
}