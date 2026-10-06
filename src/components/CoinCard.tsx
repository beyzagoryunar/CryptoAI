import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CryptoAsset } from '../types/crypto';
import { Colors } from '../constants/theme';
import { SignalBadge } from './SignalBadge';

interface CoinCardProps {
  coin: CryptoAsset;
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  const isPositive = coin.change24h >= 0;

  const handlePress = () => {
    router.push({
      pathname: '/coin/[symbol]',
      params: { symbol: coin.symbol }
    });
  };

  // Simple sparkline visual representation using small bars
  const minVal = Math.min(...coin.sparkline);
  const maxVal = Math.max(...coin.sparkline);
  const range = maxVal - minVal || 1;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={styles.card}
    >
      {/* Left: Symbol & Name */}
      <View style={styles.leftCol}>
        <View style={styles.symbolBadge}>
          <Text style={styles.symbolText}>{coin.symbol}</Text>
        </View>
        <View>
          <Text style={styles.nameText} numberOfLines={1}>{coin.name}</Text>
          <Text style={styles.volumeText}>Hacim: ${coin.volume24h}</Text>
        </View>
      </View>

      {/* Middle: Mini Trend Bars */}
      <View style={styles.sparklineContainer}>
        {coin.sparkline.map((val, idx) => {
          const heightPercent = Math.max(15, Math.min(100, ((val - minVal) / range) * 100));
          return (
            <View
              key={idx}
              style={[
                styles.sparklineBar,
                {
                  height: `${heightPercent}%`,
                  backgroundColor: isPositive ? Colors.bullish : Colors.bearish,
                  opacity: 0.35 + (idx / coin.sparkline.length) * 0.65,
                }
              ]}
            />
          );
        })}
      </View>

      {/* Right: Price & Signal */}
      <View style={styles.rightCol}>
        <Text style={styles.priceText}>
          ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <View style={styles.changeRow}>
          <Text style={[styles.changeText, { color: isPositive ? Colors.bullish : Colors.bearish }]}>
            {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
          </Text>
        </View>
        <View style={styles.signalWrapper}>
          <SignalBadge action={coin.signal.action} confidence={coin.signal.confidence} compact />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2,
    gap: 10,
  },
  symbolBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.cardBgElevated,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 13,
  },
  nameText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  volumeText: {
    color: Colors.textMuted,
    fontSize: 11,
  },
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 24,
    width: 44,
    gap: 3,
    justifyContent: 'center',
  },
  sparklineBar: {
    width: 3,
    borderRadius: 2,
  },
  rightCol: {
    alignItems: 'flex-end',
    flex: 1.1,
  },
  priceText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  changeRow: {
    marginBottom: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  signalWrapper: {
    marginTop: 2,
  },
});
