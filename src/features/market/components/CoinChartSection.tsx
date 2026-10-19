import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { Path, Rect, Line } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { useTheme } from '../../../context/ThemeContext';

interface CoinChartProps {
  currentPrice: string;
}

export const CoinChartSection: React.FC<CoinChartProps> = ({ currentPrice }) => {
  const { colors, isDark } = useTheme();
  const [chartType, setChartType] = useState<'LINE' | 'CANDLE'>('LINE');
  const [showRsi, setShowRsi] = useState<boolean>(true);

  // Mock OHLC verileri (Mum grafiği için)
  const mockCandles = [
    { o: 60, c: 45, h: 40, l: 65, isGreen: true },
    { o: 45, c: 55, h: 38, l: 60, isGreen: false },
    { o: 55, c: 70, h: 50, l: 75, isGreen: false },
    { o: 70, c: 48, h: 42, l: 72, isGreen: true },
    { o: 48, c: 35, h: 30, l: 52, isGreen: true },
    { o: 35, c: 22, h: 18, l: 40, isGreen: true },
    { o: 22, c: 38, h: 20, l: 45, isGreen: false },
    { o: 38, c: 50, h: 32, l: 58, isGreen: false },
    { o: 50, c: 30, h: 25, l: 55, isGreen: true },
    { o: 30, c: 18, h: 12, l: 35, isGreen: true },
  ];

  return (
    <View style={styles.container}>
      {/* Grafik Tipi & Gösterge Seçicileri */}
      <View style={styles.toolbarRow}>
        <View style={[styles.typeSwitch, { backgroundColor: isDark ? '#10151E' : '#E2E8F0' }]}>
          <Pressable
            style={[styles.switchBtn, chartType === 'LINE' && [styles.switchBtnActive, { backgroundColor: colors.card }]]}
            onPress={() => setChartType('LINE')}
          >
            <Text style={[styles.switchText, { color: chartType === 'LINE' ? colors.textPrimary : colors.textMuted }]}>
              📈 Çizgi
            </Text>
          </Pressable>
          <Pressable
            style={[styles.switchBtn, chartType === 'CANDLE' && [styles.switchBtnActive, { backgroundColor: colors.card }]]}
            onPress={() => setChartType('CANDLE')}
          >
            <Text style={[styles.switchText, { color: chartType === 'CANDLE' ? colors.textPrimary : colors.textMuted }]}>
              🕯️ Mum (OHLC)
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.rsiToggle,
            { backgroundColor: showRsi ? (isDark ? 'rgba(0, 178, 254, 0.15)' : '#E0F2FE') : colors.card, borderColor: showRsi ? colors.primary : colors.border },
          ]}
          onPress={() => setShowRsi(!showRsi)}
        >
          <Text style={[styles.rsiToggleText, { color: showRsi ? colors.primary : colors.textSecondary }]}>
            RSI (14)
          </Text>
        </Pressable>
      </View>

      {/* Ana Grafik Alanı */}
      <View style={styles.chartCanvas}>
        {/* Canlı Fiyat Rozeti */}
        <View style={styles.floatingPriceBadge}>
          <Text style={styles.badgeText}>{currentPrice}</Text>
        </View>

        {chartType === 'LINE' ? (
          <Svg width="100%" height="110" viewBox="0 0 350 110">
            <Path
              d="M0,70 C40,50 70,85 110,80 C150,75 180,25 220,20 C260,15 280,75 310,70 C330,65 350,20 350,20"
              fill="none"
              stroke="#00E676"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </Svg>
        ) : (
          /* Mum Grafiği (Candlesticks) */
          <Svg width="100%" height="110" viewBox="0 0 350 110">
            {mockCandles.map((c, i) => {
              const x = 15 + i * 33;
              const color = c.isGreen ? '#00E676' : '#FF3B30';
              const top = Math.min(c.o, c.c);
              const height = Math.max(Math.abs(c.c - c.o), 6);

              return (
                <React.Fragment key={i}>
                  {/* Fitil (Wick) */}
                  <Line x1={x + 7} y1={c.h} x2={x + 7} y2={c.l} stroke={color} strokeWidth="1.5" />
                  {/* Mum Gövdesi (Body) */}
                  <Rect x={x} y={top} width="14" height={height} rx="2" fill={color} />
                </React.Fragment>
              );
            })}
          </Svg>
        )}
      </View>

      {/* RSI(14) Osilatör Paneli */}
      {showRsi && (
        <View style={[styles.rsiPanel, { backgroundColor: isDark ? '#0C131E' : '#F1F5F9', borderColor: colors.border }]}>
          <View style={styles.rsiHeader}>
            <Text style={[styles.rsiTitle, { color: colors.textSecondary }]}>RSI (14) Osilatörü</Text>
            <Text style={[styles.rsiValue, { color: colors.primary }]}>62.40 (Nötr / Alım)</Text>
          </View>
          <View style={styles.rsiBarTrack}>
            <View style={[styles.rsiZone, { left: 0, width: '30%', backgroundColor: 'rgba(0, 230, 118, 0.15)' }]} />
            <View style={[styles.rsiZone, { left: '70%', width: '30%', backgroundColor: 'rgba(255, 59, 48, 0.15)' }]} />
            <View style={[styles.rsiPointer, { left: '62.4%' }]} />
          </View>
          <View style={styles.rsiLabelsRow}>
            <Text style={styles.rsiLabel}>0 (Aşırı Satım: 30)</Text>
            <Text style={styles.rsiLabel}>70 (Aşırı Alım)</Text>
            <Text style={styles.rsiLabel}>100</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeSwitch: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
  },
  switchBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
  },
  switchBtnActive: {},
  switchText: {
    ...typography.captionBold,
    fontSize: 12,
  },
  rsiToggle: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  rsiToggleText: {
    ...typography.captionBold,
    fontSize: 12,
  },
  chartCanvas: {
    height: 120,
    justifyContent: 'center',
    position: 'relative',
    marginVertical: spacing.xs,
  },
  floatingPriceBadge: {
    position: 'absolute',
    right: 0,
    top: 15,
    backgroundColor: '#00E676',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    zIndex: 10,
  },
  badgeText: {
    ...typography.captionBold,
    color: '#052914',
    fontSize: 11,
  },
  rsiPanel: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  rsiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  rsiTitle: {
    ...typography.micro,
  },
  rsiValue: {
    ...typography.captionBold,
  },
  rsiBarTrack: {
    height: 8,
    backgroundColor: '#1E293B',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  rsiZone: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
  rsiPointer: {
    position: 'absolute',
    top: -2,
    width: 4,
    height: 12,
    backgroundColor: '#00B2FE',
    borderRadius: 2,
  },
  rsiLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rsiLabel: {
    ...typography.micro,
    color: '#64748B',
    fontSize: 9,
  },
});
