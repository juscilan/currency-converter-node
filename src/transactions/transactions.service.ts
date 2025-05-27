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
    const rate = await this.currencyService.getExchangeRate(
      fromCurrency,
      toCurrency,
    );

    console.log("<<<<<<<<<<<<<< Exchange Rate >>>>>>>>>>>>");
    console.log(`${fromValue}`);
    console.log("<<<<<<<<<<<<<< Exchange Rate >>>>>>>>>>>>");


    const toValue = fromValue * rate;

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

}