import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CurrencyService } from '../currency/currency.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    private readonly currencyService: CurrencyService,
  ) {}

  async createExchangeTransaction(
    userId: number,
    fromCurrency: string,
    toCurrency: string,
    fromValue: number,
  ): Promise<Transaction> {
    // Get current exchange rate
    const rate = await this.currencyService.getExchangeRate(
      fromCurrency,
      toCurrency,
    );
    const toValue = fromValue * rate;

    // Create and save transaction
    const transaction = this.transactionRepository.create({
      userId,
      fromCurrency,
      toCurrency,
      fromValue,
      toValue,
      rate,
      timestamp: new Date(),
    });

    return this.transactionRepository.save(transaction);
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({ where: { userId } });
  }

  async getTransaction(transactionId: number): Promise<Transaction | null> {
    return this.transactionRepository.findOne({ where: { transactionId } });
  }

  async getUserTotalExchanged(
    userId: number,
    currency: string,
  ): Promise<{ totalFrom: number; totalTo: number }> {
    const result = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.fromValue)', 'totalFrom')
      .addSelect('SUM(transaction.toValue)', 'totalTo')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.fromCurrency = :currency', { currency })
      .getRawOne();

    return {
      totalFrom: parseFloat(result.totalFrom) || 0,
      totalTo: parseFloat(result.totalTo) || 0,
    };
  }
}