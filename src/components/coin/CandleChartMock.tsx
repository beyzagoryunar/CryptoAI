import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CryptoAsset } from '../../types/crypto';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  coin: CryptoAsset;
  timeframe: string;
}

export const CandleChartMock: React.FC<Props> = ({ coin, timeframe }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.chartCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={styles.chartHeader}>
        <Text style={[styles.chartTitle, { color: colors.textPrimary }]}>Fiyat & Bollinger Kanalı ({timeframe})</Text>
        <Text style={[styles.chartSub, { color: colors.textMuted }]}>Binance WebSocket Verisi</Text>
      </View>

      <View style={[styles.barsArea, { backgroundColor: colors.inputBg }]}>
        {coin.sparkline.map((val, idx) => {
          const min = Math.min(...coin.sparkline) * 0.995;
          const max = Math.max(...coin.sparkline) * 1.005;
          const heightPercent = Math.max(20, Math.min(95, ((val - min) / (max - min)) * 100));
          const isBarGreen = idx === 0 ? true : val >= coin.sparkline[idx - 1];

          return (
            <View key={idx} style={styles.candleCol}>
              <View style={[styles.wick, { backgroundColor: isBarGreen ? colors.bullish : colors.bearish }]} />
              <View
                style={[
                  styles.candleBody,
                  {
                    height: `${heightPercent}%`,
                    backgroundColor: isBarGreen ? colors.bullish : colors.bearish,
                  },
                ]}
              />
              <View style={[styles.wick, { backgroundColor: isBarGreen ? colors.bullish : colors.bearish }]} />
            </View>
          );
        })}
      </View>

      <View style={styles.chartFooter}>
        <Text style={[styles.chartAxisLabel, { color: colors.textMuted }]}>Düşük: ${coin.low24h.toLocaleString()}</Text>
        <Text style={[styles.chartAxisLabel, { color: colors.textMuted }]}>Yüksek: ${coin.high24h.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  chartSub: {
    fontSize: 11,
  },
  barsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 140,
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  candleCol: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: 28,
  },
  wick: {
    width: 1.5,
    height: 12,
    opacity: 0.6,
  },
  candleBody: {
    width: 14,
    borderRadius: 3,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chartAxisLabel: {
    fontSize: 11,
  },
});
