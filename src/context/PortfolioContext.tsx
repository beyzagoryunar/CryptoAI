import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CryptoAsset, Position, TradeHistoryItem, PortfolioContextType } from '../types/crypto';
import { INITIAL_COINS } from '../constants/initialCoins';
import { useAuth } from './AuthContext';
import {
  INITIAL_PORTFOLIO_BALANCE,
  DEFAULT_DEMO_POSITIONS,
  DEFAULT_DEMO_TRADE_HISTORY,
  fetchUserPortfolio,
  saveUserPortfolio,
} from '../services/portfolioService';

const defaultPortfolioContext: PortfolioContextType = {
  coins: INITIAL_COINS, cashBalance: INITIAL_PORTFOLIO_BALANCE, totalBalance: INITIAL_PORTFOLIO_BALANCE,
  totalPnL: 0, totalPnLPercent: 0, positions: [], tradeHistory: [],
  openPosition: () => false, closePosition: () => {}, resetPortfolio: () => {},
};
const PortfolioContext = createContext<PortfolioContextType>(defaultPortfolioContext);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [coins, setCoins] = useState<CryptoAsset[]>(INITIAL_COINS);
  const [cashBalance, setCashBalance] = useState<number>(INITIAL_PORTFOLIO_BALANCE);
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);

  // Synchronize portfolio data with Firestore when user logs in or switches
  useEffect(() => {
    let isMounted = true;
    const syncPortfolio = async () => {
      if (!user) {
        setCashBalance(INITIAL_PORTFOLIO_BALANCE);
        setPositions([]);
        setTradeHistory([]);
        return;
      }
      if (user.authProvider === 'demo') {
        setCashBalance(6800.00);
        setPositions(DEFAULT_DEMO_POSITIONS);
        setTradeHistory(DEFAULT_DEMO_TRADE_HISTORY);
        return;
      }

      const remote = await fetchUserPortfolio(user.id);
      if (isMounted) {
        if (remote) {
          setCashBalance(remote.cashBalance);
          setPositions(remote.positions);
          setTradeHistory(remote.tradeHistory);
        } else {
          setCashBalance(user.balance ?? INITIAL_PORTFOLIO_BALANCE);
          setPositions([]);
          setTradeHistory([]);
          saveUserPortfolio(user.id, {
            cashBalance: user.balance ?? INITIAL_PORTFOLIO_BALANCE,
            positions: [],
            tradeHistory: [],
          });
        }
      }
    };
    syncPortfolio();
    return () => { isMounted = false; };
  }, [user]);

  // Simulated Binance WebSocket Price Feed
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins((prevCoins) =>
        prevCoins.map((coin) => {
          if (Math.random() > 0.45) return coin;
          const fluctuation = (Math.random() - 0.48) * 0.004;
          const newPrice = Number((coin.price * (1 + fluctuation)).toFixed(coin.price < 1 ? 4 : 2));
          const newChange24h = Number((coin.change24h + fluctuation * 10).toFixed(2));
          return { ...coin, price: newPrice, change24h: newChange24h };
        })
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Compute live positions with latest prices and recalculate PnL
  const livePositions = useMemo(() => {
    return positions.map((pos) => {
      const coin = coins.find((c) => c.symbol === pos.symbol);
      if (!coin) return pos;
      const currentVal = pos.amount * coin.price;
      const pnl = pos.side === 'BUY' ? currentVal - pos.totalCost : pos.totalCost - currentVal;
      const pnlPercent = (pnl / pos.totalCost) * 100;
      return {
        ...pos,
        currentPrice: coin.price,
        pnl: Number(pnl.toFixed(2)),
        pnlPercent: Number(pnlPercent.toFixed(2)),
      };
    });
  }, [coins, positions]);

  const totalPositionsValue = useMemo(() => {
    return livePositions.reduce((acc, pos) => acc + pos.amount * pos.currentPrice, 0);
  }, [livePositions]);

  const totalPositionsCost = useMemo(() => {
    return livePositions.reduce((acc, pos) => acc + pos.totalCost, 0);
  }, [livePositions]);

  const totalPnL = totalPositionsValue - totalPositionsCost;
  const totalBalance = cashBalance + totalPositionsValue;
  const totalPnLPercent = totalPositionsCost > 0 ? (totalPnL / totalPositionsCost) * 100 : 0;

  const openPosition = useCallback((symbol: string, side: 'BUY' | 'SELL', amountUsd: number, isAutopilot: boolean = false): boolean => {
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

    const nextCash = cashBalance - amountUsd;
    const nextPositions = [newPos, ...positions];
    setCashBalance(nextCash);
    setPositions(nextPositions);

    if (user?.id && user.authProvider !== 'demo') {
      saveUserPortfolio(user.id, { cashBalance: nextCash, positions: nextPositions });
    }
    return true;
  }, [cashBalance, coins, positions, user]);

  const closePosition = useCallback((positionId: string, reason: TradeHistoryItem['closedReason'] = 'Manuel') => {
    const pos = livePositions.find((p) => p.id === positionId);
    if (!pos) return;

    const returnAmount = pos.totalCost + pos.pnl;
    const nextCash = cashBalance + returnAmount;
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

    const nextPositions = positions.filter((p) => p.id !== positionId);
    const nextHistory = [historyItem, ...tradeHistory];
    setCashBalance(nextCash);
    setPositions(nextPositions);
    setTradeHistory(nextHistory);

    if (user?.id && user.authProvider !== 'demo') {
      saveUserPortfolio(user.id, { cashBalance: nextCash, positions: nextPositions, tradeHistory: nextHistory });
    }
  }, [cashBalance, livePositions, positions, tradeHistory, user]);

  const resetPortfolio = useCallback(() => {
    setCashBalance(INITIAL_PORTFOLIO_BALANCE);
    setPositions([]);
    if (user?.id && user.authProvider !== 'demo') {
      saveUserPortfolio(user.id, { cashBalance: INITIAL_PORTFOLIO_BALANCE, positions: [] });
    }
  }, [user]);

  return (
    <PortfolioContext.Provider
      value={{
        coins, cashBalance, totalBalance, totalPnL, totalPnLPercent,
        positions: livePositions, tradeHistory, openPosition, closePosition, resetPortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
