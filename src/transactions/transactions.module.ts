// src/transactions/transactions.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
// import { TransactionsController } from './transactions.controller';
import { Transaction } from './transaction.entity';
import { CurrencyModule } from '../currency/currency.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]), // This provides the repository
    CurrencyModule, // Import the CurrencyModule to access CurrencyService
  ],
  controllers: [],
  providers: [TransactionsService],
  exports: [TransactionsService], // Optional: only if you need to use it in other modules
})
export class TransactionsModule {}