import React, { createContext, useContext, useState } from 'react';
import {
  PortfolioSummaryDto,
  CoinMarketDto,
  AutopilotStatusDto,
  CreateAlarmDto,
} from '../services/api/types';
import { cryptoService } from '../services/api/cryptoService';
import {
  mockPortfolio,
  mockCoins,
  mockAutopilotStatus,
} from '../services/api/mockData';

export type RiskProfileType = 'Muhafazakar' | 'Dengeli' | 'Agresif';

export interface AutopilotSettings {
  riskProfile: RiskProfileType;
  stopLossPercent: number;
  takeProfitPercent: number;
  maxTradeAllocationPercent: number;
}

interface AppContextType {
  portfolio: PortfolioSummaryDto;
  coins: CoinMarketDto[];
  autopilot: AutopilotStatusDto;
  autopilotSettings: AutopilotSettings;
  updateAutopilotSettings: (settings: Partial<AutopilotSettings>) => void;
  refreshData: () => Promise<void>;
  toggleAutopilot: () => Promise<void>;
  toggleWatchlist: (symbol: string) => Promise<void>;
  createAlarm: (data: CreateAlarmDto) => Promise<boolean>;
  executeTrade: (symbol: string, type: 'BUY' | 'SELL', amount: number, costUsd: number) => Promise<boolean>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<PortfolioSummaryDto>(mockPortfolio);
  const [coins, setCoins] = useState<CoinMarketDto[]>(mockCoins);
  const [autopilot, setAutopilot] = useState<AutopilotStatusDto>(mockAutopilotStatus);
  const [autopilotSettings, setAutopilotSettings] = useState<AutopilotSettings>({
    riskProfile: 'Dengeli',
    stopLossPercent: 10,
    takeProfitPercent: 20,
    maxTradeAllocationPercent: 25,
  });

  const updateAutopilotSettings = (newSettings: Partial<AutopilotSettings>) => {
    setAutopilotSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const refreshData = async () => {
    const [p, c, a] = await Promise.all([
      cryptoService.getPortfolio(),
      cryptoService.getCoins(),
      cryptoService.getAutopilotStatus(),
    ]);
    setPortfolio(p);
    setCoins(c);
    setAutopilot(a);
  };

  const toggleAutopilot = async () => {
    const newState = await cryptoService.toggleAutopilot();
    setAutopilot((prev) => ({ ...prev, isRunning: newState }));
    setPortfolio((prev) => ({ ...prev, isAutopilotActive: newState }));
  };

  const toggleWatchlist = async (symbol: string) => {
    await cryptoService.toggleWatchlist(symbol);
    setCoins((prev) =>
      prev.map((c) => (c.symbol === symbol ? { ...c, isWatchlisted: !c.isWatchlisted } : c))
    );
  };

  const createAlarm = async (data: CreateAlarmDto): Promise<boolean> => {
    const success = await cryptoService.createAlarm(data);
    if (success) {
      setCoins((prev) =>
        prev.map((c) => (c.symbol === data.symbol ? { ...c, hasAlarm: true } : c))
      );
    }
    return success;
  };

  const executeTrade = async (
    symbol: string,
    type: 'BUY' | 'SELL',
    amount: number,
    costUsd: number
  ): Promise<boolean> => {
    setPortfolio((prev) => {
      const updatedHoldings = [...prev.holdings];
      const cashIndex = updatedHoldings.findIndex((h) => h.isCash);
      const coinIndex = updatedHoldings.findIndex((h) => h.symbol === symbol);

      if (type === 'BUY') {
        if (cashIndex >= 0) {
          updatedHoldings[cashIndex] = {
            ...updatedHoldings[cashIndex],
            amount: Math.max(0, updatedHoldings[cashIndex].amount - costUsd),
            valueUsd: Math.max(0, updatedHoldings[cashIndex].valueUsd - costUsd),
          };
        }
        if (coinIndex >= 0) {
          updatedHoldings[coinIndex] = {
            ...updatedHoldings[coinIndex],
            amount: updatedHoldings[coinIndex].amount + amount,
            valueUsd: updatedHoldings[coinIndex].valueUsd + costUsd,
          };
        } else {
          const coinMeta = coins.find((c) => c.symbol === symbol);
          updatedHoldings.push({
            symbol,
            name: `${amount} ${symbol}`,
            amount,
            valueUsd: costUsd,
            changeUsd: 0,
            iconLetter: coinMeta?.iconLetter || symbol[0],
            color: coinMeta?.color || '#00B2FE',
          });
        }
      } else {
        // SELL
        if (coinIndex >= 0) {
          const remainingAmount = Math.max(0, updatedHoldings[coinIndex].amount - amount);
          updatedHoldings[coinIndex] = {
            ...updatedHoldings[coinIndex],
            amount: remainingAmount,
            valueUsd: Math.max(0, updatedHoldings[coinIndex].valueUsd - costUsd),
          };
        }
        if (cashIndex >= 0) {
          updatedHoldings[cashIndex] = {
            ...updatedHoldings[cashIndex],
            amount: updatedHoldings[cashIndex].amount + costUsd,
            valueUsd: updatedHoldings[cashIndex].valueUsd + costUsd,
          };
        }
      }

      const newTotal = updatedHoldings.reduce((sum, h) => sum + h.valueUsd, 0);
      return {
        ...prev,
        totalBalanceUsd: newTotal,
        holdings: updatedHoldings,
      };
    });

    // Otopilot işlem günlüğüne ekle
    const newLog = {
      id: `trade_${Date.now()}`,
      type,
      title: `${symbol} Manuel ${type === 'BUY' ? 'Alım' : 'Satış'}`,
      symbol,
      amountInfo: `${amount.toFixed(4)} ${symbol} ($${costUsd.toFixed(2)})`,
      reason: 'Kullanıcı paneli üzerinden manuel emir yürütüldü.',
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setAutopilot((prev) => ({
      ...prev,
      totalTradesCount: prev.totalTradesCount + 1,
      logs: [newLog, ...prev.logs],
    }));

    return true;
  };

  return (
    <AppContext.Provider
      value={{
        portfolio,
        coins,
        autopilot,
        autopilotSettings,
        updateAutopilotSettings,
        refreshData,
        toggleAutopilot,
        toggleWatchlist,
        createAlarm,
        executeTrade,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
