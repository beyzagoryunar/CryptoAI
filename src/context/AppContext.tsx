import React, { createContext, useContext, useState, useEffect } from 'react';
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

interface AppContextType {
  portfolio: PortfolioSummaryDto;
  coins: CoinMarketDto[];
  autopilot: AutopilotStatusDto;
  refreshData: () => Promise<void>;
  toggleAutopilot: () => Promise<void>;
  toggleWatchlist: (symbol: string) => Promise<void>;
  createAlarm: (data: CreateAlarmDto) => Promise<boolean>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioSummaryDto>(mockPortfolio);
  const [coins, setCoins] = useState<CoinMarketDto[]>(mockCoins);
  const [autopilot, setAutopilot] = useState<AutopilotStatusDto>(mockAutopilotStatus);

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
      prev.map((c) =>
        c.symbol === symbol ? { ...c, isWatchlisted: !c.isWatchlisted } : c
      )
    );
  };

  const createAlarm = async (data: CreateAlarmDto): Promise<boolean> => {
    const success = await cryptoService.createAlarm(data);
    if (success) {
      setCoins((prev) =>
        prev.map((c) =>
          c.symbol === data.symbol ? { ...c, hasAlarm: true } : c
        )
      );
    }
    return success;
  };

  return (
    <AppContext.Provider
      value={{
        portfolio,
        coins,
        autopilot,
        refreshData,
        toggleAutopilot,
        toggleWatchlist,
        createAlarm,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
