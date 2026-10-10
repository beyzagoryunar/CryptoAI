import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Position } from '../../types/crypto';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  position: Position;
  onClose: (id: string, symbol: string, pnl: number) => void;
}

export const PositionCard: React.FC<Props> = ({ position, onClose }) => {
  const { t } = useLanguage();
  const { colors } = useTheme();
  const isPosProfit = position.pnl >= 0;

  return (
    <View style={[styles.posCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={styles.posHeader}>
        <View style={styles.posSymbolRow}>
          <Text style={[styles.posSymbol, { color: colors.textPrimary }]}>{position.symbol}</Text>
          <View
            style={[
              styles.sideBadge,
              { backgroundColor: position.side === 'BUY' ? colors.bullishMuted : colors.bearishMuted },
            ]}
          >
            <Text style={[styles.sideText, { color: position.side === 'BUY' ? colors.bullish : colors.bearish }]}>
              {position.side}
            </Text>
          </View>
          {position.isAutopilot && (
            <View style={[styles.autopilotTag, { backgroundColor: colors.primaryMuted }]}>
              <Ionicons name="flash" size={10} color={colors.primary} />
              <Text style={[styles.autopilotTagText, { color: colors.primary }]}>AI Otopilot</Text>
            </View>
          )}
        </View>

        <View style={styles.posPnlCol}>
          <Text style={[styles.posPnl, { color: isPosProfit ? colors.bullish : colors.bearish }]}>
            {isPosProfit ? '+' : ''}${position.pnl.toFixed(2)}
          </Text>
          <Text style={[styles.posPnlPercent, { color: isPosProfit ? colors.bullish : colors.bearish }]}>
            {isPosProfit ? '+' : ''}{position.pnlPercent.toFixed(2)}%
          </Text>
        </View>
      </View>

      <View style={[styles.posGrid, { backgroundColor: colors.cardBgElevated }]}>
        <View style={styles.posGridItem}>
          <Text style={[styles.posGridLabel, { color: colors.textMuted }]}>Giriş Fiyatı</Text>
          <Text style={[styles.posGridValue, { color: colors.textPrimary }]}>
            ${position.entryPrice.toLocaleString()}
          </Text>
        </View>
        <View style={styles.posGridItem}>
          <Text style={[styles.posGridLabel, { color: colors.textMuted }]}>Güncel Fiyat</Text>
          <Text style={[styles.posGridValue, { color: colors.textPrimary }]}>
            ${position.currentPrice.toLocaleString()}
          </Text>
        </View>
        <View style={styles.posGridItem}>
          <Text style={[styles.posGridLabel, { color: colors.textMuted }]}>Miktar</Text>
          <Text style={[styles.posGridValue, { color: colors.textPrimary }]}>
            {position.amount} {position.symbol}
          </Text>
        </View>
        <View style={styles.posGridItem}>
          <Text style={[styles.posGridLabel, { color: colors.textMuted }]}>Toplam Değer</Text>
          <Text style={[styles.posGridValue, { color: colors.textPrimary }]}>
            ${(position.amount * position.currentPrice).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={[styles.targetsRow, { borderTopColor: colors.border }]}>
        <Text style={[styles.triggerText, { color: colors.textSecondary }]}>
          Hedef Kâr: <Text style={{ color: colors.bullish }}>${position.targetProfit.toLocaleString()}</Text>
        </Text>
        <Text style={[styles.triggerText, { color: colors.textSecondary }]}>
          Zarar Kes: <Text style={{ color: colors.bearish }}>${position.stopLoss.toLocaleString()}</Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onClose(position.id, position.symbol, position.pnl)}
        style={[styles.closePosBtn, { backgroundColor: colors.bearishMuted }]}
        activeOpacity={0.8}
      >
        <Text style={[styles.closePosBtnText, { color: colors.bearish }]}>{t('close_position')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  posCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  posHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  posSymbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  posSymbol: {
    fontSize: 16,
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
  autopilotTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autopilotTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  posPnlCol: {
    alignItems: 'flex-end',
  },
  posPnl: {
    fontSize: 15,
    fontWeight: '700',
  },
  posPnlPercent: {
    fontSize: 11,
    fontWeight: '600',
  },
  posGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  posGridItem: {
    width: '50%',
    paddingVertical: 4,
  },
  posGridLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  posGridValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  targetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    marginBottom: 12,
  },
  triggerText: {
    fontSize: 11,
  },
  closePosBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  closePosBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
