import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Position } from '../../types/crypto';

interface Props {
  totalBalance: number;
  cashBalance: number;
  totalPnL: number;
  totalPnLPercent: number;
  positions: Position[];
  onReset: () => void;
}

export const PortfolioMetricsCard: React.FC<Props> = ({
  totalBalance,
  cashBalance,
  totalPnL,
  totalPnLPercent,
  positions,
  onReset,
}) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const isProfit = totalPnL >= 0;

  return (
    <View style={[styles.balanceCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={styles.balanceHeader}>
        <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>{t('total_balance')}</Text>
        <TouchableOpacity onPress={onReset} style={[styles.resetBtn, { backgroundColor: colors.cardBgElevated }]}>
          <Ionicons name="refresh-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.resetText, { color: colors.textMuted }]}>Sıfırla</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.balanceValue, { color: colors.textPrimary }]}>
        ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </Text>

      <View style={styles.pnlRow}>
        <View style={[styles.pnlBadge, { backgroundColor: isProfit ? colors.bullishMuted : colors.bearishMuted }]}>
          <Ionicons
            name={isProfit ? 'trending-up' : 'trending-down'}
            size={14}
            color={isProfit ? colors.bullish : colors.bearish}
          />
          <Text style={[styles.pnlText, { color: isProfit ? colors.bullish : colors.bearish }]}>
            {isProfit ? '+' : ''}${totalPnL.toFixed(2)} ({isProfit ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
          </Text>
        </View>
        <Text style={[styles.pnlDuration, { color: colors.textMuted }]}>Toplam Getiri</Text>
      </View>

      {/* Asset Allocation Bar */}
      <View style={[styles.allocationSection, { borderTopColor: colors.border }]}>
        <View style={styles.allocationHeader}>
          <Text style={[styles.allocationTitle, { color: colors.textSecondary }]}>Varlık Dağılımı</Text>
          <Text style={[styles.cashText, { color: colors.primary }]}>
            Nakit: ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </Text>
        </View>
        <View style={[styles.allocationBarContainer, { backgroundColor: colors.cardBgElevated }]}>
          <View
            style={[
              styles.allocationSegment,
              { width: `${Math.max(5, (cashBalance / totalBalance) * 100)}%`, backgroundColor: colors.primary },
            ]}
          />
          {positions.map((pos, idx) => {
            const segPercent = Math.max(3, ((pos.amount * pos.currentPrice) / totalBalance) * 100);
            const palette = [colors.bullish, colors.secondary, colors.neutral];
            return (
              <View
                key={pos.id}
                style={[
                  styles.allocationSegment,
                  { width: `${segPercent}%`, backgroundColor: palette[idx % palette.length] },
                ]}
              />
            );
          })}
        </View>
        <View style={styles.allocationLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>USD Nakit</Text>
          </View>
          {positions.map((pos, idx) => {
            const palette = [colors.bullish, colors.secondary, colors.neutral];
            return (
              <View key={pos.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: palette[idx % palette.length] }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>{pos.symbol}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  balanceCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resetText: {
    fontSize: 11,
    fontWeight: '600',
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pnlText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pnlDuration: {
    fontSize: 12,
  },
  allocationSection: {
    paddingTop: 14,
    borderTopWidth: 1,
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  allocationTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  cashText: {
    fontSize: 12,
    fontWeight: '700',
  },
  allocationBarContainer: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 10,
  },
  allocationSegment: {
    height: '100%',
  },
  allocationLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
  },
});
