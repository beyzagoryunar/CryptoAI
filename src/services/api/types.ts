// Kullanıcı & Oturum Tipleri (Spring Boot Auth DTO'ları ile uyumlu)
export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  uid: string;
  isEmailVerified: boolean;
}

export interface AuthResponseDto {
  token: string;
  user: UserDto;
}

// Portföy Tipleri
export interface HoldingDto {
  symbol: string;
  name: string;
  amount: number;
  valueUsd: number;
  changeUsd: number;
  changePercent?: number;
  iconLetter: string;
  color: string;
  isCash?: boolean;
}

export interface PortfolioSummaryDto {
  totalBalanceUsd: number;
  dailyChangeUsd: number;
  isAutopilotActive: boolean;
  llmAnalysisText: string;
  holdings: HoldingDto[];
}

// Piyasa & Kripto Tipleri (Binance/Backend Ticker DTO'ları ile uyumlu)
export type AiSignalType = 'GÜÇLÜ AL' | 'AL' | 'NÖTR' | 'SAT';

export interface CoinMarketDto {
  symbol: string;
  name: string;
  priceUsd: number;
  change24h: number;
  changeUsd?: number;
  high24h: number;
  low24h: number;
  volumeBtc: string;
  rsi: number;
  aiSignal: AiSignalType;
  aiConfidencePercent: number;
  aiAnalysisText: string;
  isWatchlisted: boolean;
  hasAlarm?: boolean;
  iconLetter: string;
  color: string;
}

// Otopilot & Alarm Tipleri
export interface AutopilotLogDto {
  id: string;
  type: 'BUY' | 'SELL';
  title: string;
  symbol: string;
  amountInfo: string;
  profitUsd?: number;
  reason: string;
  time: string;
}

export interface AutopilotStatusDto {
  isRunning: boolean;
  activeModelName: string;
  realizedProfit24h: number;
  successRatePercent: number;
  totalTradesCount: number;
  logs: AutopilotLogDto[];
}

export interface CreateAlarmDto {
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  sendNotification: boolean;
  autoSellAutopilot: boolean;
  sellPercentage?: number;
}
