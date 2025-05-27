import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createExchange(
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionsService.createExchangeTransaction(
      createTransactionDto.userId,
      createTransactionDto.fromCurrency,
      createTransactionDto.toCurrency,
      createTransactionDto.fromValue,
    );
  }

  @Get('')
  async getUserTransactions(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Transaction[]> {
    return this.transactionsService.getUserTransactions(userId);
  }
  
}