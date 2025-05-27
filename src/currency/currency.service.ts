import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CurrencyService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.currencyapi.com/v3';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // this.apiKey = this.configService.get<string>('CURRENCY_API_KEY') || '';
    this.apiKey = 'cur_live_YBIZ5pNf35OPzw6jszr3dMtsYbGtih4uDNg2fsqd'
    if (!this.apiKey) {
      throw new Error('Currency API key not configured');
    }
  }

  async getExchangeRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;
    
    const rates = await this.getLatestRates(from);
    const rate = rates.data[to]?.value;
    
    if (!rate) {
        throw new Error(`Exchange rate from ${from} to ${to} not available`);
    }
    
    return rate;
  }

  async getLatestRates(baseCurrency: string = 'USD'): Promise<any> {
    const url = `${this.baseUrl}/latest?apikey=${this.apiKey}&base_currency=${baseCurrency}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async getHistoricalRates(
    date: string,
    baseCurrency: string = 'USD',
  ): Promise<any> {
    const url = `${this.baseUrl}/historical?apikey=${this.apiKey}&base_currency=${baseCurrency}&date=${date}`;
    const response = await firstValueFrom(this.httpService.get(url));
    return response.data;
  }

  async convertCurrency(
    from: string,
    to: string,
    amount: number,
  ): Promise<number> {
    const rates = await this.getLatestRates(from);
    const rate = rates.data[to];
    if (!rate) {
      throw new Error(`Exchange rate for ${to} not available`);
    }
    return amount * rate.value;
  }
}