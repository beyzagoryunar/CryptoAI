import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { HoldingDto } from '../../../services/api/types';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { useTheme } from '../../../context/ThemeContext';

interface HoldingItemProps {
  holding: HoldingDto;
  onPress?: () => void;
}

export const HoldingItem: React.FC<HoldingItemProps> = ({ holding, onPress }) => {
  const { colors } = useTheme();
  const isPositive = holding.changeUsd > 0;
  const isNegative = holding.changeUsd < 0;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.leftRow}>
        <View style={[styles.iconCircle, { backgroundColor: holding.color }]}>
          <Text style={styles.iconLetter}>{holding.iconLetter}</Text>
        </View>
        <View>
          <Text style={[styles.symbol, { color: colors.textPrimary }]}>{holding.symbol}</Text>
          <Text style={[styles.name, { color: colors.textSecondary }]}>{holding.name}</Text>
        </View>
      </View>

      <View style={styles.rightColumn}>
        <Text style={[styles.value, { color: colors.textPrimary }]}>
          ${holding.valueUsd.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>
        {holding.isCash ? (
          <Text style={styles.cashDash}>--</Text>
        ) : (
          <View
            style={[
              styles.changeBadge,
              isPositive && styles.badgePositive,
              isNegative && styles.badgeNegative,
            ]}
          >
            <Text
              style={[
                styles.changeText,
                isPositive && styles.textPositive,
                isNegative && styles.textNegative,
              ]}
            >
              {isPositive ? `+$${holding.changeUsd.toFixed(2)}` : `-$${Math.abs(holding.changeUsd).toFixed(2)}`}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  symbol: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  name: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  value: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
  },
  cashDash: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 4,
  },
  changeBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgePositive: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  badgeNegative: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  changeText: {
    ...typography.captionBold,
    fontSize: 12,
  },
  textPositive: {
    color: colors.success,
  },
  textNegative: {
    color: colors.danger,
  },
});
