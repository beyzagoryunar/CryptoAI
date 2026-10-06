import React, { createContext, useContext, useState, useEffect } from 'react';
import { CryptoAsset, Position, TradeHistoryItem } from '../types/crypto';
import { INITIAL_COINS } from '../constants/initialCoins';

interface PortfolioContextType {
  coins: CryptoAsset[];
  cashBalance: number;
  totalBalance: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: Position[];
  tradeHistory: TradeHistoryItem[];
  openPosition: (symbol: string, side: 'BUY' | 'SELL', amountUsd: number, isAutopilot?: boolean) => boolean;
  closePosition: (positionId: string, reason?: TradeHistoryItem['closedReason']) => void;
  resetPortfolio: () => void;
}

const INITIAL_BALANCE = 10000.00;

const PortfolioContext = createContext<PortfolioContextType>({
  coins: INITIAL_COINS,
  cashBalance: INITIAL_BALANCE,
  totalBalance: INITIAL_BALANCE,
  totalPnL: 0,
  totalPnLPercent: 0,
  positions: [],
  tradeHistory: [],
  openPosition: () => false,
  closePosition: () => {},
  resetPortfolio: () => {},
});

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [coins, setCoins] = useState<CryptoAsset[]>(INITIAL_COINS);
  const [cashBalance, setCashBalance] = useState<number>(6800.00); // 6800 cash + 3200 in positions
  const [positions, setPositions] = useState<Position[]>([
    {
      id: 'pos_btc_1',
      symbol: 'BTC',
      name: 'Bitcoin',
      side: 'BUY',
      entryPrice: 63100.00,
      currentPrice: 64250.00,
      amount: 0.0317,
      totalCost: 2000.00,
      targetProfit: 67500.00,
      stopLoss: 62800.00,
      pnl: 36.45,
      pnlPercent: 1.82,
      openedAt: 'Bugün 11:20',
      isAutopilot: true,
    },
    {
      id: 'pos_sol_2',
      symbol: 'SOL',
      name: 'Solana',
      side: 'BUY',
      entryPrice: 145.20,
      currentPrice: 152.80,
      amount: 8.264,
      totalCost: 1200.00,
      targetProfit: 168.00,
      stopLoss: 145.00,
      pnl: 62.80,
      pnlPercent: 5.23,
      openedAt: 'Bugün 12:45',
      isAutopilot: true,
    }
  ]);

  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([
    {
      id: 'hist_eth_1',
      symbol: 'ETH',
      side: 'BUY',
      entryPrice: 3350.00,
      closePrice: 3470.00,
      amount: 0.447,
      pnl: 53.64,
      pnlPercent: 3.58,
      closedAt: 'Dün 21:15',
      closedReason: 'Take-Profit',
      isAutopilot: true,
    },
    {
      id: 'hist_near_2',
      symbol: 'NEAR',
      side: 'BUY',
      entryPrice: 4.80,
      closePrice: 5.12,
      amount: 104.16,
      pnl: 33.33,
      pnlPercent: 6.67,
      closedAt: 'Dün 18:30',
      closedReason: 'Take-Profit',
      isAutopilot: true,
    }
  ]);

  // Simulated Binance WebSocket Price Feed (flurry of small realistic live ticks)
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => {
          // Select 3 random coins per tick to simulate live Binance trade stream
          if (Math.random() > 0.45) return coin;
          const fluctuationPercent = (Math.random() - 0.48) * 0.004; // -0.19% to +0.21%
          const newPrice = Number((coin.price * (1 + fluctuationPercent)).toFixed(coin.price < 1 ? 4 : 2));
          const newChange24h = Number((coin.change24h + fluctuationPercent * 10).toFixed(2));
          return {
            ...coin,
            price: newPrice,
            change24h: newChange24h,
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Update positions with latest coin prices and calculate live PnL
  useEffect(() => {
    setPositions((prevPositions) =>
      prevPositions.map((pos) => {
        const coin = coins.find((c) => c.symbol === pos.symbol);
        if (!coin) return pos;
        const currentVal = pos.amount * coin.price;
        const pnl = pos.side === 'BUY' 
          ? currentVal - pos.totalCost 
          : pos.totalCost - currentVal;
        const pnlPercent = (pnl / pos.totalCost) * 100;

        return {
          ...pos,
          currentPrice: coin.price,
          pnl: Number(pnl.toFixed(2)),
          pnlPercent: Number(pnlPercent.toFixed(2)),
        };
      })
    );
  }, [coins]);

  // Calculate totals
  const totalPositionsValue = positions.reduce((acc, pos) => {
    return acc + pos.amount * pos.currentPrice;
  }, 0);

  const totalPositionsCost = positions.reduce((acc, pos) => acc + pos.totalCost, 0);
  const totalPnL = totalPositionsValue - totalPositionsCost;
  const totalBalance = cashBalance + totalPositionsValue;
  const totalPnLPercent = totalPositionsCost > 0 ? (totalPnL / totalPositionsCost) * 100 : 0;

  const openPosition = (
    symbol: string,
    side: 'BUY' | 'SELL',
    amountUsd: number,
    isAutopilot: boolean = false
  ): boolean => {
    if (cashBalance < amountUsd) return false;
    const coin = coins.find((c) => c.symbol === symbol);
    if (!coin) return false;

    const coinAmount = amountUsd / coin.price;
    const newPos: Position = {
      id: `pos_${symbol}_${Date.now()}`,
      symbol: coin.symbol,
      name: coin.name,
      side,
      entryPrice: coin.price,
      currentPrice: coin.price,
      amount: Number(coinAmount.toFixed(4)),
      totalCost: amountUsd,
      targetProfit: coin.signal.targetProfit,
      stopLoss: coin.signal.stopLoss,
      pnl: 0,
      pnlPercent: 0,
      openedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      isAutopilot,
    };

    setCashBalance((prev) => prev - amountUsd);
    setPositions((prev) => [newPos, ...prev]);
    return true;
  };

  const closePosition = (
    positionId: string,
    reason: TradeHistoryItem['closedReason'] = 'Manuel'
  ) => {
    const pos = positions.find((p) => p.id === positionId);
    if (!pos) return;

    const returnAmount = pos.totalCost + pos.pnl;
    setCashBalance((prev) => prev + returnAmount);

    const historyItem: TradeHistoryItem = {
      id: `hist_${Date.now()}`,
      symbol: pos.symbol,
      side: pos.side,
      entryPrice: pos.entryPrice,
      closePrice: pos.currentPrice,
      amount: pos.amount,
      pnl: pos.pnl,
      pnlPercent: pos.pnlPercent,
      closedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      closedReason: reason,
      isAutopilot: pos.isAutopilot,
    };

    setTradeHistory((prev) => [historyItem, ...prev]);
    setPositions((prev) => prev.filter((p) => p.id !== positionId));
  };

  const resetPortfolio = () => {
    setCashBalance(INITIAL_BALANCE);
    setPositions([]);
  };

  return (
    <PortfolioContext.Provider
      value={{
        coins,
        cashBalance,
        totalBalance,
        totalPnL,
        totalPnLPercent,
        positions,
        tradeHistory,
        openPosition,
        closePosition,
        resetPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
