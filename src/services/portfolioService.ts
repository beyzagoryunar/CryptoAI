import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { Position, TradeHistoryItem } from '../types/crypto';

export const INITIAL_PORTFOLIO_BALANCE = 10000.00;

export const DEFAULT_DEMO_POSITIONS: Position[] = [
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
  },
];

export const DEFAULT_DEMO_TRADE_HISTORY: TradeHistoryItem[] = [
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
  },
];

export interface PortfolioData {
  cashBalance: number;
  positions: Position[];
  tradeHistory: TradeHistoryItem[];
}

export const fetchUserPortfolio = async (uid: string): Promise<PortfolioData | null> => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      return {
        cashBalance: typeof data.balance === 'number' ? data.balance : (typeof data.cashBalance === 'number' ? data.cashBalance : INITIAL_PORTFOLIO_BALANCE),
        positions: Array.isArray(data.positions) ? data.positions : [],
        tradeHistory: Array.isArray(data.tradeHistory) ? data.tradeHistory : [],
      };
    }
  } catch (err) {
    console.log('Firebase fetch portfolio error:', err);
  }
  return null;
};

export const saveUserPortfolio = async (uid: string, data: Partial<PortfolioData>): Promise<void> => {
  try {
    const updatePayload: Record<string, any> = {};
    if (data.cashBalance !== undefined) {
      updatePayload.balance = data.cashBalance;
      updatePayload.cashBalance = data.cashBalance;
    }
    if (data.positions !== undefined) {
      updatePayload.positions = data.positions;
    }
    if (data.tradeHistory !== undefined) {
      updatePayload.tradeHistory = data.tradeHistory;
    }
    updatePayload.updatedAt = new Date().toISOString();

    await setDoc(doc(db, 'users', uid), updatePayload, { merge: true });
  } catch (err) {
    console.log('Firebase save portfolio error:', err);
  }
};
