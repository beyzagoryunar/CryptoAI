import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { CryptoAsset } from '../types/crypto';
import { useTheme } from '../context/ThemeContext';
import { SignalBadge } from './SignalBadge';

interface CoinCardProps {
  coin: CryptoAsset;
}

export const CoinCard: React.FC<CoinCardProps> = memo(({ coin }) => {
  const { colors } = useTheme();
  const isPositive = coin.change24h >= 0;

  const handlePress = () => {
    router.push({
      pathname: '/coin/[symbol]',
      params: { symbol: coin.symbol },
    });
  };

  const minVal = Math.min(...coin.sparkline);
  const maxVal = Math.max(...coin.sparkline);
  const range = maxVal - minVal || 1;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
    >
      {/* Left: Symbol & Name */}
      <View style={styles.leftCol}>
        <View style={[styles.symbolBadge, { backgroundColor: colors.cardBgElevated, borderColor: colors.borderLight }]}>
          <Text style={[styles.symbolText, { color: colors.textPrimary }]}>{coin.symbol}</Text>
        </View>
        <View>
          <Text style={[styles.nameText, { color: colors.textPrimary }]} numberOfLines={1}>
            {coin.name}
          </Text>
          <Text style={[styles.volumeText, { color: colors.textMuted }]}>Hacim: ${coin.volume24h}</Text>
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
                  backgroundColor: isPositive ? colors.bullish : colors.bearish,
                  opacity: 0.35 + (idx / coin.sparkline.length) * 0.65,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Right: Price & Signal */}
      <View style={styles.rightCol}>
        <Text style={[styles.priceText, { color: colors.textPrimary }]}>
          ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <View style={styles.changeRow}>
          <Text style={[styles.changeText, { color: isPositive ? colors.bullish : colors.bearish }]}>
            {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
          </Text>
        </View>
        <View style={styles.signalWrapper}>
          <SignalBadge action={coin.signal.action} confidence={coin.signal.confidence} compact />
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontWeight: '800',
    fontSize: 13,
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  volumeText: {
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

CoinCard.displayName = 'CoinCard';
