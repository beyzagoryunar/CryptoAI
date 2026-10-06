import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AISignal } from '../types/crypto';
import { Colors } from '../constants/theme';
import { SignalBadge } from './SignalBadge';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';

interface ExplainableAICardProps {
  signal: AISignal;
  currentPrice: number;
}

export const ExplainableAICard: React.FC<ExplainableAICardProps> = ({ signal, currentPrice }) => {
  const { t } = useLanguage();

  const tpPercent = (((signal.targetProfit - currentPrice) / currentPrice) * 100).toFixed(1);
  const slPercent = (((signal.stopLoss - currentPrice) / currentPrice) * 100).toFixed(1);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.aiIconBadge}>
            <Ionicons name="hardware-chip" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.cardTitle}>{t('explainable_ai')}</Text>
        </View>
        <SignalBadge action={signal.action} confidence={signal.confidence} />
      </View>

      {/* Confidence Bar */}
      <View style={styles.confidenceSection}>
        <View style={styles.confidenceHeader}>
          <Text style={styles.confidenceLabel}>{t('ai_confidence')}</Text>
          <Text style={styles.confidenceValue}>%{signal.confidence}</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${signal.confidence}%` }]} />
        </View>
      </View>

      {/* Targets (Take-Profit & Stop-Loss) */}
      <View style={styles.targetsGrid}>
        <View style={[styles.targetBox, styles.tpBox]}>
          <View style={styles.targetIconRow}>
            <Ionicons name="flag" size={14} color={Colors.bullish} />
            <Text style={styles.targetLabel}>{t('take_profit')}</Text>
          </View>
          <Text style={styles.targetPrice}>${signal.targetProfit.toLocaleString()}</Text>
          <Text style={styles.targetPercent}>+{tpPercent}% Potansiyel</Text>
        </View>

        <View style={[styles.targetBox, styles.slBox]}>
          <View style={styles.targetIconRow}>
            <Ionicons name="shield" size={14} color={Colors.bearish} />
            <Text style={styles.targetLabel}>{t('stop_loss')}</Text>
          </View>
          <Text style={styles.targetPrice}>${signal.stopLoss.toLocaleString()}</Text>
          <Text style={styles.slPercent}>{slPercent}% Risk Sınırı</Text>
        </View>
      </View>

      {/* Support & Resistance */}
      <View style={styles.levelsRow}>
        <View style={styles.levelItem}>
          <Text style={styles.levelLabel}>{t('support')}</Text>
          <Text style={styles.levelValue}>${signal.supportLevel.toLocaleString()}</Text>
        </View>
        <View style={styles.levelDivider} />
        <View style={styles.levelItem}>
          <Text style={styles.levelLabel}>{t('resistance')}</Text>
          <Text style={styles.levelValue}>${signal.resistanceLevel.toLocaleString()}</Text>
        </View>
      </View>

      {/* Reasoning Section (Why AI took this decision) */}
      <View style={styles.reasoningSection}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
          <Text style={styles.reasoningTitle}>{t('reasoning_title')}</Text>
        </View>
        {signal.reasoning.map((reason, index) => (
          <View key={index} style={styles.reasonItem}>
            <Ionicons name="checkmark-circle-outline" size={14} color={Colors.bullish} style={styles.bulletIcon} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      {/* Indicators Breakdown (Screener) */}
      <View style={styles.indicatorsSection}>
        <Text style={styles.indicatorsTitle}>{t('technical_indicators')}</Text>
        <View style={styles.indicatorsGrid}>
          <View style={styles.indicatorPill}>
            <Text style={styles.indLabel}>RSI (14)</Text>
            <Text style={[styles.indValue, { color: signal.indicators.rsi < 35 ? Colors.bullish : signal.indicators.rsi > 70 ? Colors.bearish : Colors.textPrimary }]}>
              {signal.indicators.rsi}
            </Text>
          </View>
          <View style={styles.indicatorPill}>
            <Text style={styles.indLabel}>NLP Duygu (Haber)</Text>
            <Text style={[styles.indValue, { color: Colors.primary }]}>
              %{signal.indicators.sentimentScore} Pozitif
            </Text>
          </View>
          <View style={[styles.indicatorPill, { width: '100%' }]}>
            <Text style={styles.indLabel}>MACD Durumu</Text>
            <Text style={styles.indValue}>{signal.indicators.macd}</Text>
          </View>
          <View style={[styles.indicatorPill, { width: '100%' }]}>
            <Text style={styles.indLabel}>Bollinger Bantları</Text>
            <Text style={styles.indValue}>{signal.indicators.bollinger}</Text>
          </View>
          <View style={[styles.indicatorPill, { width: '100%' }]}>
            <Text style={styles.indLabel}>EMA Trend Eğilimi</Text>
            <Text style={styles.indValue}>{signal.indicators.emaTrend}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  aiIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  confidenceSection: {
    marginBottom: 16,
  },
  confidenceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  confidenceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  confidenceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  targetsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  targetBox: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  tpBox: {
    backgroundColor: Colors.bullishMuted,
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  slBox: {
    backgroundColor: Colors.bearishMuted,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  targetIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  targetLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  targetPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  targetPercent: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.bullish,
  },
  slPercent: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.bearish,
  },
  levelsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    alignItems: 'center',
  },
  levelItem: {
    flex: 1,
    alignItems: 'center',
  },
  levelDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  levelLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  levelValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  reasoningSection: {
    backgroundColor: 'rgba(0, 216, 246, 0.04)',
    borderColor: 'rgba(0, 216, 246, 0.2)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  reasoningTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 6,
  },
  bulletIcon: {
    marginTop: 2,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  indicatorsSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  indicatorsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  indicatorPill: {
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: '48%',
  },
  indLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  indValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
