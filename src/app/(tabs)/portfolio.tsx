import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../../components/Header';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { PortfolioMetricsCard } from '../../components/portfolio/PortfolioMetricsCard';
import { PositionCard } from '../../components/portfolio/PositionCard';
import { TradeHistoryList } from '../../components/portfolio/TradeHistoryList';

export default function PortfolioScreen() {
  const {
    totalBalance,
    cashBalance,
    totalPnL,
    totalPnLPercent,
    positions,
    tradeHistory,
    closePosition,
    resetPortfolio,
  } = usePortfolio();
  const { t } = useLanguage();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  const handleClosePosition = (id: string, symbol: string, pnl: number) => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined'
        ? window.confirm(`${symbol} pozisyonunu mevcut fiyattan kapatmak istiyor musunuz? (Net K/Z: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)})`)
        : true;
      if (confirmed) closePosition(id, 'Manuel');
      return;
    }

    Alert.alert(
      'Pozisyon Kapatma',
      `${symbol} pozisyonunu mevcut fiyattan kapatmak istiyor musunuz? (Net K/Z: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)})`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Kapat', style: 'destructive', onPress: () => closePosition(id, 'Manuel') },
      ]
    );
  };

  const handleReset = () => {
    if (Platform.OS === 'web') {
      const confirmed = typeof window !== 'undefined'
        ? window.confirm('Sanal bakiyeniz başlangıç değeri olan $10.000 seviyesine döndürülecektir.')
        : true;
      if (confirmed) resetPortfolio();
      return;
    }

    Alert.alert(
      'Cüzdanı Sıfırla',
      'Sanal bakiyeniz başlangıç değeri olan $10.000 seviyesine döndürülecektir.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        { text: 'Sıfırla', style: 'destructive', onPress: resetPortfolio },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <PortfolioMetricsCard
          totalBalance={totalBalance}
          cashBalance={cashBalance}
          totalPnL={totalPnL}
          totalPnLPercent={totalPnLPercent}
          positions={positions}
          onReset={handleReset}
        />

        {/* Tab Switcher */}
        <View style={[styles.tabSwitcher, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <TouchableOpacity
            onPress={() => setActiveTab('positions')}
            style={[styles.switchTab, activeTab === 'positions' && { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}
          >
            <Text style={[styles.switchTabText, { color: activeTab === 'positions' ? colors.primary : colors.textSecondary }]}>
              {t('active_positions')} ({positions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={[styles.switchTab, activeTab === 'history' && { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}
          >
            <Text style={[styles.switchTabText, { color: activeTab === 'history' ? colors.primary : colors.textSecondary }]}>
              {t('trade_history')} ({tradeHistory.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Positions View */}
        {activeTab === 'positions' && (
          positions.length === 0 ? (
            <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
              <Ionicons name="folder-open-outline" size={40} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>{t('no_positions')}</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {"Piyasa Radarı'ndan coin seçerek veya Otopilot'u açarak işlem başlatabilirsiniz."}
              </Text>
            </View>
          ) : (
            positions.map((pos) => (
              <PositionCard key={pos.id} position={pos} onClose={handleClosePosition} />
            ))
          )
        )}

        {/* Trade History View */}
        {activeTab === 'history' && <TradeHistoryList tradeHistory={tradeHistory} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  tabSwitcher: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    marginBottom: 16,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  switchTabText: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
