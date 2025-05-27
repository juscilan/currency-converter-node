import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './transaction.entity';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;

  const mockTransaction: Transaction = {
    transactionId: 1,
    userId: 1,
    fromCurrency: 'USD',
    toCurrency: 'EUR',
    fromValue: 100,
    toValue: 85,
    rate: 0.85,
    timestamp: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: {
            createExchangeTransaction: jest.fn().mockResolvedValue(mockTransaction),
            getUserTransactions: jest.fn().mockResolvedValue([mockTransaction]),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
  });

  describe('createExchange', () => {
    it('should call service with correct parameters', async () => {
      const createDto: CreateTransactionDto = {
        userId: 1,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        fromValue: 100,
      };

      const result = await controller.createExchange(createDto);

      expect(transactionsService.createExchangeTransaction).toHaveBeenCalledWith(
        1,
        'USD',
        'EUR',
        100,
      );
      expect(result).toEqual(mockTransaction);
    });
  });

  describe('getUserTransactions', () => {
    it('should call service with userId', async () => {
      const userId = 1;
      const result = await controller.getUserTransactions(userId);

      expect(transactionsService.getUserTransactions).toHaveBeenCalledWith(userId);
      expect(result).toEqual([mockTransaction]);
    });

  });

  // Edge case tests
  describe('edge cases', () => {
    it('should handle empty user transactions', async () => {
      jest.spyOn(transactionsService, 'getUserTransactions').mockResolvedValue([]);
      const result = await controller.getUserTransactions(999);
      expect(result).toEqual([]);
    });

    it('should handle service errors', async () => {
      jest.spyOn(transactionsService, 'createExchangeTransaction').mockRejectedValue(new Error('Service error'));
      await expect(
        controller.createExchange({
          userId: 1,
          fromCurrency: 'USD',
          toCurrency: 'EUR',
          fromValue: 100,
        }),
      ).rejects.toThrow('Service error');
    });
  });
});