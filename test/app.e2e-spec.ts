import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsModule } from '../src/transactions/transactions.module';
import { Transaction } from '../src/transactions/transaction.entity';
import { CurrencyModule } from '../src/currency/currency.module';
import { ConfigModule } from '@nestjs/config';

describe('Transactions Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Transaction],
          synchronize: true,
        }),
        TransactionsModule,
        CurrencyModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /transactions', () => {
    it('should create a new transaction', async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          userId: 1,
          fromCurrency: 'USD',
          toCurrency: 'EUR',
          fromValue: 100,
        })
        .expect(201);

      expect(response.body).toEqual({
        transactionId: expect.any(Number),
        userId: 1,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        fromValue: 100,
        toValue: expect.any(Number),
        rate: expect.any(Number),
        timestamp: expect.any(String),
      });
    });

    it('should return 400 for invalid userId', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          userId: 'invalid',
          fromCurrency: 'USD',
          toCurrency: 'EUR',
          fromValue: 100,
        })
        .expect(400);
    });

    it('should return 400 for missing fromCurrency', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          userId: 1,
          toCurrency: 'EUR',
          fromValue: 100,
        })
        .expect(400);
    });

    it('should return 400 for invalid fromValue', async () => {
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          userId: 1,
          fromCurrency: 'USD',
          toCurrency: 'EUR',
          fromValue: 'invalid',
        })
        .expect(400);
    });
  });

  describe('GET /transactions', () => {
    it('should return transactions for a user', async () => {
      // First create a transaction
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          userId: 2,
          fromCurrency: 'USD',
          toCurrency: 'GBP',
          fromValue: 50,
        });

      const response = await request(app.getHttpServer())
        .get('/transactions?userId=2')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].userId).toBe(2);
    });

    it('should return empty array for user with no transactions', async () => {
      const response = await request(app.getHttpServer())
        .get('/transactions?userId=999')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 400 for missing userId', async () => {
      await request(app.getHttpServer())
        .get('/transactions')
        .expect(400);
    });

    it('should return 400 for invalid userId', async () => {
      await request(app.getHttpServer())
        .get('/transactions?userId=invalid')
        .expect(400);
    });
  });

});