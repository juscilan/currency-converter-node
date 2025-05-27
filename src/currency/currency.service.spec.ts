import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { CurrencyService } from './currency.service';
import { of } from 'rxjs';

describe('CurrencyService', () => {
  let service: CurrencyService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-api-key'),
          },
        },
      ],
    }).compile();

    service = module.get<CurrencyService>(CurrencyService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should throw error if API key is not configured', () => {
      // Mock configService.get to return undefined
      jest.spyOn(configService, 'get').mockReturnValue(undefined);

      expect(() => new CurrencyService(httpService, configService)).toThrowError(
        'Currency API key not configured',
      );
    });

    it('should initialize with API key from config', () => {
      expect(service).toBeDefined();
      expect(configService.get).toHaveBeenCalledWith('CURRENCY_API_KEY');
    });
  });

  describe('getLatestRates', () => {
    it('should fetch latest rates', async () => {
      const mockResponse = {
        data: {
          data: {
            USD: { value: 1 },
            EUR: { value: 0.85 },
            GBP: { value: 0.73 },
          },
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(mockResponse as any));

      const result = await service.getLatestRates('USD');

      expect(result).toEqual(mockResponse.data);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://api.currencyapi.com/v3/latest?apikey=test-api-key&base_currency=USD',
      );
    });

    it('should handle API errors', async () => {
      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('API error');
      });

      await expect(service.getLatestRates('USD')).rejects.toThrow('API error');
    });
  });

  describe('getExchangeRate', () => {
    it('should return 1 for same currency', async () => {
      const result = await service.getExchangeRate('USD', 'USD');
      expect(result).toBe(1);
    });

    it('should fetch exchange rate for different currencies', async () => {
      const mockRates = {
        data: {
          EUR: { value: 0.85 },
        },
      };

      jest.spyOn(service, 'getLatestRates').mockResolvedValue(mockRates);

      const result = await service.getExchangeRate('USD', 'EUR');
      expect(result).toBe(0.85);
      expect(service.getLatestRates).toHaveBeenCalledWith('USD');
    });

    it('should throw error if rate not available', async () => {
      const mockRates = {
        data: {
          EUR: { value: 0.85 },
        },
      };

      jest.spyOn(service, 'getLatestRates').mockResolvedValue(mockRates);

      await expect(service.getExchangeRate('USD', 'GBP')).rejects.toThrowError(
        'Exchange rate from USD to GBP not available',
      );
    });
  });

  // Edge case tests
  describe('edge cases', () => {
    it('should handle empty API response', async () => {
      jest.spyOn(service, 'getLatestRates').mockResolvedValue({ data: {} });

      await expect(service.getExchangeRate('USD', 'EUR')).rejects.toThrowError(
        'Exchange rate from USD to EUR not available',
      );
    });

    it('should handle null rate value', async () => {
      jest
        .spyOn(service, 'getLatestRates')
        .mockResolvedValue({ data: { EUR: { value: null } } });

      await expect(service.getExchangeRate('USD', 'EUR')).rejects.toThrowError(
        'Exchange rate from USD to EUR not available',
      );
    });

    it('should handle undefined rate value', async () => {
      jest
        .spyOn(service, 'getLatestRates')
        .mockResolvedValue({ data: { EUR: {} } });

      await expect(service.getExchangeRate('USD', 'EUR')).rejects.toThrowError(
        'Exchange rate from USD to EUR not available',
      );
    });
  });
});