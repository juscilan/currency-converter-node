import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('')
  async createExchange(
    @Body('userId', ParseIntPipe) userId: number,
    @Body('fromCurrency') fromCurrency: string,
    @Body('toCurrency') toCurrency: string,
    @Body('fromValue') fromValue: number,
  ): Promise<Transaction> {
    return this.transactionsService.createExchangeTransaction(
      userId,
      fromCurrency,
      toCurrency,
      fromValue,
    );
  }

  @Get('')
  async getUserTransactions(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Transaction[]> {
    return this.transactionsService.getUserTransactions(userId);
  }

}