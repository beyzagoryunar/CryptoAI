import {
  UserDto,
  AuthResponseDto,
  PortfolioSummaryDto,
  CoinMarketDto,
  AutopilotStatusDto,
  CreateAlarmDto,
} from './types';
import {
  mockUser,
  mockPortfolio,
  mockCoins,
  mockAutopilotStatus,
} from './mockData';

// Arkadaşın backend'i bağlayınca bu adresi açıp fetch'e geçebilirsiniz
export const API_BASE_URL = 'http://localhost:8080/api';

class CryptoApiService {
  private coins = [...mockCoins];
  private portfolio = { ...mockPortfolio };
  private autopilot = { ...mockAutopilotStatus };

  // Oturum / Kimlik Doğrulama
  async login(email: string, pass: string): Promise<AuthResponseDto> {
    await this.delay(300);
    return {
      token: 'jwt_mock_token_beyza_231002035',
      user: { ...mockUser, email },
    };
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    pass: string
  ): Promise<AuthResponseDto> {
    await this.delay(300);
    const newUser: UserDto = {
      id: `usr_${Date.now()}`,
      firstName,
      lastName,
      email,
      uid: String(Math.floor(100000000 + Math.random() * 900000000)),
      isEmailVerified: true,
    };
    return {
      token: 'jwt_mock_token_registered',
      user: newUser,
    };
  }

  // Portföy
  async getPortfolio(): Promise<PortfolioSummaryDto> {
    await this.delay(150);
    return this.portfolio;
  }

  // Piyasa
  async getCoins(): Promise<CoinMarketDto[]> {
    await this.delay(150);
    return this.coins;
  }

  async getWatchlist(): Promise<CoinMarketDto[]> {
    await this.delay(100);
    return this.coins.filter((c) => c.isWatchlisted);
  }

  async toggleWatchlist(symbol: string): Promise<boolean> {
    const coin = this.coins.find((c) => c.symbol === symbol);
    if (coin) {
      coin.isWatchlisted = !coin.isWatchlisted;
      return coin.isWatchlisted;
    }
    return false;
  }

  // Otopilot
  async getAutopilotStatus(): Promise<AutopilotStatusDto> {
    await this.delay(100);
    return this.autopilot;
  }

  async toggleAutopilot(): Promise<boolean> {
    await this.delay(200);
    this.autopilot.isRunning = !this.autopilot.isRunning;
    this.portfolio.isAutopilotActive = this.autopilot.isRunning;
    return this.autopilot.isRunning;
  }

  // Alarm Oluşturma
  async createAlarm(data: CreateAlarmDto): Promise<boolean> {
    await this.delay(200);
    const coin = this.coins.find((c) => c.symbol === data.symbol);
    if (coin) {
      coin.hasAlarm = true;
    }
    return true;
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const cryptoService = new CryptoApiService();
