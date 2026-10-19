import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Header, Card, Button } from '../../../shared/components';
import { useApp } from '../../../context/AppContext';
import { CoinChartSection } from '../components/CoinChartSection';
import { RootStackParamList } from '../../../navigation/navigation.types';

type DetailRouteProp = RouteProp<RootStackParamList, 'CoinDetail'>;
type DetailNavProp = NativeStackNavigationProp<RootStackParamList>;

export const CoinDetailScreen: React.FC = () => {
  const navigation = useNavigation<DetailNavProp>();
  const route = useRoute<DetailRouteProp>();
  const { coins } = useApp();

  const symbol = route.params?.symbol || 'BTC';
  const coin = coins.find((c) => c.symbol === symbol) || coins[0];

  const [timeframe, setTimeframe] = useState<'1S' | '24S' | '1H' | '1A' | 'YTD'>('24S');

  return (
    <View style={styles.screen}>
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        titleComponent={
          <View style={styles.headerTitleRow}>
            <View style={[styles.coinCircle, { backgroundColor: coin.color }]}>
              <Text style={styles.coinCircleText}>{coin.iconLetter}</Text>
            </View>
            <Text style={styles.headerTitleText}>
              {coin.name} ({coin.symbol})
            </Text>
          </View>
        }
        rightAction={
          <Pressable
            style={styles.addAlarmButton}
            onPress={() => navigation.navigate('NewAlarm', { symbol: coin.symbol })}
          >
            <Plus size={20} color={colors.textPrimary} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Fiyat ve Değişim Hero */}
        <Text style={styles.heroPrice}>
          ${coin.priceUsd.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>

        <View style={styles.changeRow}>
          <View style={styles.pctBadge}>
            <Text style={styles.pctText}>
              {coin.change24h >= 0 ? `+${coin.change24h}%` : `${coin.change24h}%`}
            </Text>
          </View>
          <Text style={styles.diffText}>+ $420.12</Text>
          <Text style={styles.periodText}>Bugün</Text>
        </View>

        {/* Grafik Bölümü */}
        <CoinChartSection currentPrice="83.719" />

        {/* Zaman Dilimi Seçici */}
        <View style={styles.timeframeRow}>
          {(['1S', '24S', '1H', '1A', 'YTD'] as const).map((tf) => (
            <Pressable
              key={tf}
              style={[styles.tfButton, timeframe === tf && styles.tfButtonActive]}
              onPress={() => setTimeframe(tf)}
            >
              <Text
                style={[styles.tfText, timeframe === tf && styles.tfTextActive]}
              >
                {tf}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* 2x2 İstatistik Izgarası */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>24s Yüksek</Text>
            <Text style={styles.statValue}>${coin.high24h.toLocaleString('tr-TR')}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>24s Düşük</Text>
            <Text style={styles.statValue}>${coin.low24h.toLocaleString('tr-TR')}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Hacim ({coin.symbol})</Text>
            <Text style={styles.statValue}>{coin.volumeBtc}</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statLabel}>Teknik: RSI(14)</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {coin.rsi} (Nötr-AI)
            </Text>
          </Card>
        </View>

        {/* AI Karar Motoru Kartı */}
        <Card variant="active" style={styles.aiEngineCard}>
          <View style={styles.aiHeader}>
            <Text style={styles.aiTitle}>AI Karar Motoru (LSTM+XGBoost)</Text>
            <Text style={styles.aiConfidence}>
              %{coin.aiConfidencePercent} Güven
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${coin.aiConfidencePercent}%` },
              ]}
            />
          </View>

          <Text style={styles.aiRationale}>{coin.aiAnalysisText}</Text>
        </Card>
      </ScrollView>

      {/* Alt AL / SAT Buton Çubuğu */}
      <View style={styles.bottomBar}>
        <Button
          title="SAT"
          variant="danger"
          style={styles.halfBtn}
          onPress={() => {}}
        />
        <Button
          title="AL"
          variant="success"
          style={styles.halfBtn}
          onPress={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  coinCircle: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinCircleText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  headerTitleText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  addAlarmButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 90,
  },
  heroPrice: {
    ...typography.heroPrice,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pctBadge: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  pctText: {
    ...typography.captionBold,
    color: colors.success,
  },
  diffText: {
    ...typography.captionBold,
    color: colors.success,
  },
  periodText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  timeframeRow: {
    flexDirection: 'row',
    backgroundColor: '#10151E',
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: spacing.lg,
  },
  tfButton: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  tfButtonActive: {
    backgroundColor: colors.card,
  },
  tfText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  tfTextActive: {
    color: colors.textPrimary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  statCard: {
    width: '47.5%',
    marginBottom: 0,
    padding: spacing.md,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 15,
  },
  aiEngineCard: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  aiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  aiTitle: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  aiConfidence: {
    ...typography.captionBold,
    color: colors.success,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#192434',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 3,
  },
  aiRationale: {
    ...typography.body,
    color: '#AFC1D6',
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: spacing.screenPadding,
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfBtn: {
    flex: 1,
  },
});
