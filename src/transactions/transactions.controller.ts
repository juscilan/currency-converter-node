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
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new currency exchange transaction' })
  @ApiCreatedResponse({
    description: 'Transaction successfully created',
    type: Transaction,
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiBody({ type: CreateTransactionDto })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createExchange(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsService.createExchangeTransaction(
      createTransactionDto.userId,
      createTransactionDto.fromCurrency,
      createTransactionDto.toCurrency,
      createTransactionDto.fromValue,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of user transactions',
    type: [Transaction],
  })
  @ApiBadRequestResponse({ description: 'Invalid user ID format' })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: Number,
    description: 'ID of the user to fetch transactions for',
  })
  async getUserTransactions(
    @Query('userId', ParseIntPipe) userId: number,
  ): Promise<Transaction[]> {
    return this.transactionsService.getUserTransactions(userId);
  }
}