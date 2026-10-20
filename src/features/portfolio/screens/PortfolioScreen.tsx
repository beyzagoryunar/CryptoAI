import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { typography, spacing } from '../../../shared/theme';
import { useApp } from '../../../context/AppContext';
import { useTheme } from '../../../context/ThemeContext';
import { HoldingItem } from '../components/HoldingItem';
import { PortfolioHeader } from '../components/PortfolioHeader';
import { PortfolioBalanceCard } from '../components/PortfolioBalanceCard';
import { LlmAnalysisCard } from '../components/LlmAnalysisCard';
import { RootStackParamList } from '../../../navigation/navigation.types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const PortfolioScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { portfolio } = useApp();
  const { colors } = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Üst Başlık ve Bildirimler */}
      <PortfolioHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Toplam Bakiye Hero Kartı */}
        <PortfolioBalanceCard />

        {/* LLM Portföy Analizi Kartı */}
        <LlmAnalysisCard />

        {/* Cüzdanımdaki Varlıklar Başlığı */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            Cüzdanımdaki Varlıklar
          </Text>
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
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
  },
  sectionCount: {
    ...typography.caption,
  },
});
