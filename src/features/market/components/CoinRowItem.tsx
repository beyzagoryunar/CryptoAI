import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { CoinMarketDto } from '../../../services/api/types';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Badge, BadgeVariant } from '../../../shared/components/Badge';

interface CoinRowItemProps {
  coin: CoinMarketDto;
  onPress: () => void;
}

export const CoinRowItem: React.FC<CoinRowItemProps> = ({ coin, onPress }) => {
  const isPositive = coin.change24h >= 0;

  const getSignalVariant = (signal: string): BadgeVariant => {
    switch (signal) {
      case 'GÜÇLÜ AL':
        return 'strongBuy';
      case 'AL':
        return 'buy';
      case 'SAT':
        return 'sell';
      default:
        return 'neutral';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      {/* Varlık İkon ve Bilgisi */}
      <View style={styles.assetCol}>
        <View style={[styles.coinIcon, { backgroundColor: coin.color }]}>
          <Text style={styles.coinIconText}>{coin.iconLetter}</Text>
        </View>
        <View>
          <Text style={styles.symbol}>{coin.symbol}</Text>
          <Text style={styles.name}>{coin.name}</Text>
        </View>
      </View>

      {/* AI Sinyali */}
      <View style={styles.signalCol}>
        <Badge
          label={coin.aiSignal}
          variant={getSignalVariant(coin.aiSignal)}
        />
      </View>

      {/* Fiyat ve Değişim */}
      <View style={styles.priceCol}>
        <View style={styles.priceHeaderRow}>
          {coin.hasAlarm && (
            <View style={styles.alarmBadge}>
              <Bell size={11} color={colors.primary} />
            </View>
          )}
          <Text style={styles.price}>
            ${coin.priceUsd < 1
              ? coin.priceUsd.toFixed(2)
              : coin.priceUsd.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
          </Text>
        </View>

        <Text
          style={[
            styles.change,
            isPositive ? styles.textPositive : styles.textNegative,
          ]}
        >
          {isPositive ? `+${coin.change24h.toFixed(2)}%` : `${coin.change24h.toFixed(2)}%`}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#141C28',
  },
  pressed: {
    opacity: 0.7,
  },
  assetCol: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm + 2,
  },
  coinIconText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  symbol: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  name: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  signalCol: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceCol: {
    flex: 2,
    alignItems: 'flex-end',
  },
  priceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alarmBadge: {
    marginRight: 4,
  },
  price: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 15,
  },
  change: {
    ...typography.captionBold,
    marginTop: 2,
  },
  textPositive: {
    color: colors.success,
  },
  textNegative: {
    color: colors.danger,
  },
});
