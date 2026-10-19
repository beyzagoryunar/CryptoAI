import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';

interface CoinChartProps {
  currentPrice: string;
}

export const CoinChartSection: React.FC<CoinChartProps> = ({ currentPrice }) => {
  return (
    <View style={styles.container}>
      {/* Güncel Fiyat İğne Rozeti */}
      <View style={styles.floatingPriceBadge}>
        <Text style={styles.badgeText}>{currentPrice}</Text>
      </View>

      {/* SVG Grafiği */}
      <View style={styles.svgWrapper}>
        <Svg width="100%" height="100" viewBox="0 0 350 100">
          <Path
            d="M0,60 C40,40 70,80 110,75 C150,70 180,20 220,15 C260,10 280,70 310,65 C330,60 350,15 350,15"
            fill="none"
            stroke={colors.success}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      </View>

      {/* Hacim Çubukları (Volume Bars) */}
      <View style={styles.volumeRow}>
        <View style={[styles.volBar, { height: 20 }]} />
        <View style={[styles.volBar, { height: 14 }]} />
        <View style={[styles.volBar, { height: 35 }]} />
        <View style={[styles.volBar, { height: 18 }]} />
        <View style={[styles.volBar, { height: 26 }]} />
        <View style={[styles.volBar, { height: 42 }]} />
        <View style={[styles.volBar, { height: 24 }]} />
        <View style={[styles.volBar, { height: 30 }]} />
        <View style={[styles.volBar, { height: 55, backgroundColor: colors.success }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    justifyContent: 'flex-end',
    marginBottom: spacing.md,
    position: 'relative',
  },
  floatingPriceBadge: {
    position: 'absolute',
    right: 0,
    top: 15,
    backgroundColor: colors.success,
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
  svgWrapper: {
    height: 100,
    width: '100%',
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    height: 40,
    marginTop: -20,
  },
  volBar: {
    width: 6,
    backgroundColor: '#1C2534',
    borderRadius: 2,
  },
});
