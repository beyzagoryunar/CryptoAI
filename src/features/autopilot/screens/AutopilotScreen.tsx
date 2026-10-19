import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Plus, ChevronRight } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Card } from '../../../shared/components';
import { useApp } from '../../../context/AppContext';
import { RootStackParamList } from '../../../navigation/navigation.types';
import { AutopilotConfigCard } from '../components/AutopilotConfigCard';
import { AutopilotBacktestCard } from '../components/AutopilotBacktestCard';
import { useTheme } from '../../../context/ThemeContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const AutopilotScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { autopilot, toggleAutopilot } = useApp();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>AI Otopilot</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Otopilot Durum Kartı */}
        <Card variant="active" style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View style={styles.pulsingRow}>
              <View
                style={[
                  styles.pulseDot,
                  !autopilot.isRunning && styles.pulseDotInactive,
                ]}
              />
              <Text style={[styles.statusText, { color: colors.textPrimary }]}>
                {autopilot.isRunning ? 'Otopilot Çalışıyor' : 'Otopilot Durduruldu'}
              </Text>
            </View>

            <Pressable
              style={[
                styles.stopButton,
                {
                  backgroundColor: isDark ? '#0F1A28' : '#E0F2FE',
                  borderColor: isDark ? 'rgba(0, 178, 254, 0.3)' : colors.primary,
                },
              ]}
              onPress={toggleAutopilot}
              hitSlop={8}
            >
              <Text style={[styles.stopButtonText, { color: colors.primary }]}>
                {autopilot.isRunning ? 'DURDUR' : 'BAŞLAT'}
              </Text>
            </Pressable>
          </View>

          <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />

          <Text style={[styles.engineLabel, { color: colors.textSecondary }]}>Aktif Karar Motoru:</Text>
          <Text style={[styles.engineName, { color: colors.success }]}>{autopilot.activeModelName}</Text>
        </Card>

        {/* 24S Performans İstatistikleri */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>OTOPİLOT PERFORMANSI (24S)</Text>
        <View style={styles.metricsRow}>
          <Card style={styles.metricCard}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Gerçekleşen Kâr</Text>
            <Text style={[styles.metricValue, { color: colors.success }]}>
              +${autopilot.realizedProfit24h.toFixed(2)}
            </Text>
          </Card>

          <Card style={styles.metricCard}>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Model Başarı Oranı</Text>
            <Text style={[styles.metricValue, { color: colors.primary }]}>
              %{autopilot.successRatePercent}{' '}
              <Text style={[styles.tradeCount, { color: colors.textMuted }]}>
                ({autopilot.totalTradesCount} İşlem)
              </Text>
            </Text>
          </Card>
        </View>

        {/* Otopilot Özelleştirme ve Strateji Ayarları */}
        <AutopilotConfigCard />

        {/* Geçmiş Strateji Simülasyonu (Backtest) */}
        <AutopilotBacktestCard />

        {/* Son AI İşlemleri (LOG) */}
        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>SON AI İŞLEMLERİ (LOG)</Text>

        {autopilot.logs.map((log) => {
          const isSell = log.type === 'SELL';
          return (
            <Card key={log.id} style={styles.logCard}>
              <View
                style={[
                  styles.leftAccentBar,
                  { backgroundColor: isSell ? colors.success : colors.primary },
                ]}
              />
              <View style={styles.logContent}>
                <View style={styles.logTopRow}>
                  <Text style={[styles.logTitle, { color: colors.textPrimary }]}>{log.title}</Text>
                  <Text
                    style={[
                      styles.logAmount,
                      { color: isSell ? colors.success : colors.textPrimary },
                    ]}
                  >
                    {log.amountInfo}
                  </Text>
                </View>

                <View style={styles.logBottomRow}>
                  <Text style={[styles.logReason, { color: colors.textSecondary }]} numberOfLines={1}>
                    {log.reason}
                  </Text>
                  <Text style={[styles.logTime, { color: colors.textMuted }]}>{log.time}</Text>
                </View>
              </View>
            </Card>
          );
        })}

        {/* Otopilot Stratejisi Ekle Butonu */}
        <Card
          style={styles.addStrategyCard}
          onPress={() => navigation.navigate('NewAlarm', { symbol: 'ETH' })}
        >
          <View style={styles.addStrategyRow}>
            <View style={[styles.plusCircle, { backgroundColor: isDark ? '#1E293B' : '#E2E8F0' }]}>
              <Plus size={16} color={colors.primary} />
            </View>
            <Text style={[styles.addStrategyText, { color: colors.textPrimary }]}>
              Otopilot Stratejisi Ekle
            </Text>
          </View>
          <ChevronRight size={18} color={colors.textSecondary} />
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  statusCard: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pulsingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  pulseDotInactive: {
    backgroundColor: colors.textMuted,
  },
  statusText: {
    ...typography.bodyBold,
    fontSize: 16,
  },
  stopButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
  },
  stopButtonText: {
    ...typography.captionBold,
  },
  cardDivider: {
    height: 1,
    marginVertical: spacing.md,
  },
  engineLabel: {
    ...typography.caption,
    marginBottom: 4,
  },
  engineName: {
    ...typography.bodyBold,
    fontSize: 15,
  },
  sectionHeader: {
    ...typography.micro,
    marginBottom: spacing.sm,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  metricCard: {
    flex: 1,
    padding: spacing.md,
    marginBottom: 0,
  },
  metricLabel: {
    ...typography.caption,
    marginBottom: 6,
  },
  metricValue: {
    ...typography.bodyBold,
    fontSize: 18,
  },
  tradeCount: {
    ...typography.caption,
  },
  logCard: {
    padding: 0,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  leftAccentBar: {
    width: 4,
    height: '100%',
  },
  logContent: {
    flex: 1,
    padding: spacing.md,
  },
  logTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  logTitle: {
    ...typography.bodyBold,
  },
  logAmount: {
    ...typography.captionBold,
  },
  logBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logReason: {
    ...typography.caption,
    flex: 1,
    marginRight: spacing.sm,
  },
  logTime: {
    ...typography.micro,
  },
  addStrategyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginTop: spacing.md,
  },
  addStrategyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  plusCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addStrategyText: {
    ...typography.bodyBold,
  },
});
