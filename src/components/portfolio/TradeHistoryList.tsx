import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TradeHistoryItem } from '../../types/crypto';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  tradeHistory: TradeHistoryItem[];
}

export const TradeHistoryList: React.FC<Props> = ({ tradeHistory }) => {
  const { t } = useLanguage();
  const { colors } = useTheme();

  if (tradeHistory.length === 0) {
    return (
      <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Ionicons name="time-outline" size={40} color={colors.textMuted} />
        <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t('no_history')}</Text>
        <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
          Kapatılan pozisyonlar burada şeffaf bir şekilde listelenir.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {tradeHistory.map((item) => {
        const isProfitHistory = item.pnl >= 0;
        return (
          <View
            key={item.id}
            style={[styles.historyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
          >
            <View style={styles.historyHeader}>
              <View style={styles.historySymbolRow}>
                <Text style={[styles.historySymbol, { color: colors.textPrimary }]}>{item.symbol}</Text>
                <View
                  style={[
                    styles.sideBadge,
                    { backgroundColor: item.side === 'BUY' ? colors.bullishMuted : colors.bearishMuted },
                  ]}
                >
                  <Text style={[styles.sideText, { color: item.side === 'BUY' ? colors.bullish : colors.bearish }]}>
                    {item.side}
                  </Text>
                </View>
                <Text style={[styles.reasonBadge, { backgroundColor: colors.cardBgElevated, color: colors.textSecondary }]}>
                  {item.closedReason}
                </Text>
              </View>

              <Text style={[styles.historyPnl, { color: isProfitHistory ? colors.bullish : colors.bearish }]}>
                {isProfitHistory ? '+' : ''}${item.pnl.toFixed(2)}
              </Text>
            </View>

            <View style={styles.historyDetails}>
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                Giriş: ${item.entryPrice.toLocaleString()} ➡️ Çıkış: ${item.closePrice.toLocaleString()}
              </Text>
              <Text style={[styles.detailDate, { color: colors.textMuted }]}>
                {new Date(item.closedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  historyCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historySymbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historySymbol: {
    fontSize: 15,
    fontWeight: '700',
  },
  sideBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sideText: {
    fontSize: 11,
    fontWeight: '700',
  },
  reasonBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  historyPnl: {
    fontSize: 14,
    fontWeight: '700',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 11,
  },
  detailDate: {
    fontSize: 10,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
