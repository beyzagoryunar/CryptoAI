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
import { Bell } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Card, Badge } from '../../../shared/components';
import { useApp } from '../../../context/AppContext';
import { useTheme } from '../../../context/ThemeContext';
import { HoldingItem } from '../components/HoldingItem';
import { RootStackParamList } from '../../../navigation/navigation.types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const PortfolioScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { portfolio } = useApp();
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>BG</Text>
        </View>

        <View style={styles.brandRow}>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>Crypto</Text>
          <Text style={styles.brandCyan}>AI</Text>
        </View>

        <Pressable style={[styles.bellButton, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}>
          <Bell size={20} color={colors.textPrimary} />
          <View style={styles.unreadDot} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Toplam Bakiye Hero Kartı */}
        <Card style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Toplam Sanal Bakiye</Text>
            {portfolio.isAutopilotActive && (
              <Badge label="● Otopilot Açık" variant="autopilot" />
            )}
          </View>

          <Text style={[styles.balanceAmount, { color: colors.textPrimary }]}>
            ${portfolio.totalBalanceUsd.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </Text>

          <View style={styles.changeRow}>
            <Badge
              label={`+ $${portfolio.dailyChangeUsd.toFixed(2)}`}
              variant="profit"
            />
            <Text style={styles.changePeriod}>Bugün</Text>
          </View>

          {/* Varlık Dağılım Çubuğu */}
          <View style={styles.allocationBar}>
            <View style={[styles.allocSegment, { flex: 6, backgroundColor: colors.primary }]} />
            <View style={[styles.allocSegment, { flex: 2.8, backgroundColor: colors.success }]} />
            <View style={[styles.allocSegment, { flex: 1.2, backgroundColor: '#8B5CF6' }]} />
          </View>
        </Card>

        {/* LLM Portföy Analizi Kartı */}
        <Card style={styles.analysisCard}>
          <View style={styles.analysisHeader}>
            <Text style={styles.analysisEmoji}>🤖</Text>
            <Text style={styles.analysisTitle}>LLM Portföy Analizi</Text>
          </View>
          <Text style={[styles.analysisBody, { color: colors.textSecondary }]}>{portfolio.llmAnalysisText}</Text>
        </Card>

        {/* Cüzdanımdaki Varlıklar Başlığı */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Cüzdanımdaki Varlıklar</Text>
          <Text style={[styles.sectionCount, { color: colors.textMuted }]}>
            {portfolio.holdings.length} Pozisyon
          </Text>
        </View>

        {/* Varlık Listesi */}
        {portfolio.holdings.map((item) => (
          <HoldingItem
            key={item.symbol}
            holding={item}
            onPress={() => {
              if (!item.isCash) {
                navigation.navigate('CoinDetail', { symbol: item.symbol });
              }
            }}
          />
        ))}
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
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    backgroundColor: colors.background,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.captionBold,
    color: colors.primary,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  brandCyan: {
    ...typography.h3,
    color: colors.primary,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  balanceCard: {
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  balanceLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  balanceAmount: {
    ...typography.heroPrice,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  changePeriod: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  allocationBar: {
    height: 6,
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
    gap: 4,
  },
  allocSegment: {
    height: '100%',
    borderRadius: 3,
  },
  analysisCard: {
    backgroundColor: '#0E1724',
    borderColor: '#1D2A3D',
  },
  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  analysisEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  analysisTitle: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  analysisBody: {
    ...typography.body,
    color: '#B0C0D4',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  sectionCount: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
