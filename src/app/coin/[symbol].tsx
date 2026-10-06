import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { ExplainableAICard } from '../../components/ExplainableAICard';
import { QuickTradeModal } from '../../components/QuickTradeModal';
import { Ionicons } from '@expo/vector-icons';

type Timeframe = '15m' | '1h' | '4h' | '1D';

export default function CoinDetailScreen() {
  const { symbol } = useLocalSearchParams<{ symbol: string }>();
  const { coins } = usePortfolio();
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [tradeModalVisible, setTradeModalVisible] = useState(false);

  const coin = coins.find((c) => c.symbol.toLowerCase() === symbol?.toLowerCase()) || coins[0];
  const isPositive = coin.change24h >= 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSymbol}>{coin.symbol} / USDT</Text>
          <Text style={styles.headerName}>{coin.name}</Text>
        </View>

        <TouchableOpacity onPress={() => setTradeModalVisible(true)} style={styles.quickTradeHeaderBtn}>
          <Ionicons name="flash" size={16} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Price Hero Section */}
        <View style={styles.priceHero}>
          <View>
            <Text style={styles.mainPrice}>
              ${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <View style={styles.heroChangeRow}>
              <View style={[styles.heroChangeBadge, { backgroundColor: isPositive ? Colors.bullishMuted : Colors.bearishMuted }]}>
                <Ionicons
                  name={isPositive ? 'arrow-up' : 'arrow-down'}
                  size={12}
                  color={isPositive ? Colors.bullish : Colors.bearish}
                />
                <Text style={[styles.heroChangeText, { color: isPositive ? Colors.bullish : Colors.bearish }]}>
                  {isPositive ? '+' : ''}{coin.change24h.toFixed(2)}%
                </Text>
              </View>
              <Text style={styles.timeframeText}>Bugün (24s)</Text>
            </View>
          </View>

          {/* Timeframe switchers */}
          <View style={styles.timeframeContainer}>
            {(['15m', '1h', '4h', '1D'] as Timeframe[]).map((tf) => (
              <TouchableOpacity
                key={tf}
                onPress={() => setTimeframe(tf)}
                style={[styles.tfBtn, timeframe === tf && styles.tfBtnActive]}
              >
                <Text style={[styles.tfBtnText, timeframe === tf && styles.tfBtnTextActive]}>
                  {tf}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dynamic Interactive Chart Mockup Visualizer */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Fiyat & Bollinger Kanalı ({timeframe})</Text>
            <Text style={styles.chartSub}>Binance WebSocket Verisi</Text>
          </View>

          {/* Simulated Candlestick / Bar Visualization */}
          <View style={styles.barsArea}>
            {coin.sparkline.map((val, idx) => {
              const min = Math.min(...coin.sparkline) * 0.995;
              const max = Math.max(...coin.sparkline) * 1.005;
              const heightPercent = Math.max(20, Math.min(95, ((val - min) / (max - min)) * 100));
              const isBarGreen = idx === 0 ? true : val >= coin.sparkline[idx - 1];

              return (
                <View key={idx} style={styles.candleCol}>
                  {/* Upper wick */}
                  <View style={[styles.wick, { backgroundColor: isBarGreen ? Colors.bullish : Colors.bearish }]} />
                  {/* Candle body */}
                  <View
                    style={[
                      styles.candleBody,
                      {
                        height: `${heightPercent}%`,
                        backgroundColor: isBarGreen ? Colors.bullish : Colors.bearish,
                      }
                    ]}
                  />
                  {/* Lower wick */}
                  <View style={[styles.wick, { backgroundColor: isBarGreen ? Colors.bullish : Colors.bearish }]} />
                </View>
              );
            })}
          </View>

          <View style={styles.chartFooter}>
            <Text style={styles.chartAxisLabel}>Düşük: ${coin.low24h.toLocaleString()}</Text>
            <Text style={styles.chartAxisLabel}>Yüksek: ${coin.high24h.toLocaleString()}</Text>
          </View>
        </View>

        {/* Key Market Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>24s En Yüksek</Text>
            <Text style={styles.statBoxVal}>${coin.high24h.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>24s En Düşük</Text>
            <Text style={styles.statBoxVal}>${coin.low24h.toLocaleString()}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>24s Hacim</Text>
            <Text style={styles.statBoxVal}>${coin.volume24h}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statBoxLabel}>Piyasa Değeri</Text>
            <Text style={styles.statBoxVal}>${coin.marketCap}</Text>
          </View>
        </View>

        {/* Explainable AI Card (Professor Core Requirement) */}
        <ExplainableAICard signal={coin.signal} currentPrice={coin.price} />

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => setTradeModalVisible(true)}
          activeOpacity={0.8}
          style={styles.tradeActionBtn}
        >
          <Ionicons name="swap-vertical" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.tradeActionText}>Hızlı Sanal İşlem Aç (Al / Sat)</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Trade Modal */}
      <QuickTradeModal
        visible={tradeModalVisible}
        onClose={() => setTradeModalVisible(false)}
        coin={coin}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerSymbol: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerName: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  quickTradeHeaderBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  container: {
    padding: 16,
  },
  priceHero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  mainPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  heroChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  heroChangeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  heroChangeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  timeframeText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  timeframeContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 8,
    padding: 3,
  },
  tfBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tfBtnActive: {
    backgroundColor: Colors.primary,
  },
  tfBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tfBtnTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  chartSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  barsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 140,
    paddingVertical: 10,
    backgroundColor: Colors.inputBg,
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
    color: Colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBoxLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statBoxVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  tradeActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
  },
  tradeActionText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '800',
  },
});
