import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { Header } from '../../components/Header';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function PortfolioScreen() {
  const { totalBalance, cashBalance, totalPnL, totalPnLPercent, positions, tradeHistory, closePosition, resetPortfolio } = usePortfolio();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'positions' | 'history'>('positions');

  const isProfit = totalPnL >= 0;

  const handleClosePosition = (id: string, symbol: string, pnl: number) => {
    Alert.alert(
      'Pozisyon Kapatma',
      `${symbol} pozisyonunu mevcut fiyattan kapatmak istiyor musunuz? (Net K/Z: ${pnl >= 0 ? '+' : ''}$${pnl.toFixed(2)})`,
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Kapat',
          style: 'destructive',
          onPress: () => closePosition(id, 'Manuel'),
        }
      ]
    );
  };

  const handleReset = () => {
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
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Main Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>{t('total_balance')}</Text>
            <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
              <Ionicons name="refresh-outline" size={14} color={Colors.textMuted} />
              <Text style={styles.resetText}>Sıfırla</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.balanceValue}>
            ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>

          <View style={styles.pnlRow}>
            <View style={[styles.pnlBadge, { backgroundColor: isProfit ? Colors.bullishMuted : Colors.bearishMuted }]}>
              <Ionicons
                name={isProfit ? 'trending-up' : 'trending-down'}
                size={14}
                color={isProfit ? Colors.bullish : Colors.bearish}
              />
              <Text style={[styles.pnlText, { color: isProfit ? Colors.bullish : Colors.bearish }]}>
                {isProfit ? '+' : ''}${totalPnL.toFixed(2)} ({isProfit ? '+' : ''}{totalPnLPercent.toFixed(2)}%)
              </Text>
            </View>
            <Text style={styles.pnlDuration}>Toplam Getiri</Text>
          </View>

          {/* Asset Allocation Bar */}
          <View style={styles.allocationSection}>
            <View style={styles.allocationHeader}>
              <Text style={styles.allocationTitle}>Varlık Dağılımı</Text>
              <Text style={styles.cashText}>Nakit: ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Text>
            </View>
            <View style={styles.allocationBarContainer}>
              <View
                style={[
                  styles.allocationSegment,
                  { width: `${Math.max(5, (cashBalance / totalBalance) * 100)}%`, backgroundColor: Colors.primary }
                ]}
              />
              {positions.map((pos, idx) => {
                const segPercent = Math.max(3, ((pos.amount * pos.currentPrice) / totalBalance) * 100);
                const colors = [Colors.bullish, Colors.secondary, Colors.neutral];
                return (
                  <View
                    key={pos.id}
                    style={[
                      styles.allocationSegment,
                      { width: `${segPercent}%`, backgroundColor: colors[idx % colors.length] }
                    ]}
                  />
                );
              })}
            </View>
            <View style={styles.allocationLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.legendText}>USD Nakit</Text>
              </View>
              {positions.map((pos, idx) => {
                const colors = [Colors.bullish, Colors.secondary, Colors.neutral];
                return (
                  <View key={pos.id} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors[idx % colors.length] }]} />
                    <Text style={styles.legendText}>{pos.symbol}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Tab Switcher: Positions / History */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            onPress={() => setActiveTab('positions')}
            style={[styles.switchTab, activeTab === 'positions' && styles.switchTabActive]}
          >
            <Text style={[styles.switchTabText, activeTab === 'positions' && styles.switchTabTextActive]}>
              {t('active_positions')} ({positions.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('history')}
            style={[styles.switchTab, activeTab === 'history' && styles.switchTabActive]}
          >
            <Text style={[styles.switchTabText, activeTab === 'history' && styles.switchTabTextActive]}>
              {t('trade_history')} ({tradeHistory.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Active Positions Tab */}
        {activeTab === 'positions' && (
          <View style={styles.tabContent}>
            {positions.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="folder-open-outline" size={40} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>{t('no_positions')}</Text>
                <Text style={styles.emptySubtitle}>Piyasa Radarı'ndan coin seçerek veya Otopilot'u açarak işlem başlatabilirsiniz.</Text>
              </View>
            ) : (
              positions.map((pos) => {
                const isPosProfit = pos.pnl >= 0;
                return (
                  <View key={pos.id} style={styles.posCard}>
                    <View style={styles.posHeader}>
                      <View style={styles.posSymbolRow}>
                        <Text style={styles.posSymbol}>{pos.symbol}</Text>
                        <View style={[styles.sideBadge, { backgroundColor: pos.side === 'BUY' ? Colors.bullishMuted : Colors.bearishMuted }]}>
                          <Text style={[styles.sideText, { color: pos.side === 'BUY' ? Colors.bullish : Colors.bearish }]}>
                            {pos.side}
                          </Text>
                        </View>
                        {pos.isAutopilot && (
                          <View style={styles.autopilotTag}>
                            <Ionicons name="flash" size={10} color={Colors.primary} />
                            <Text style={styles.autopilotTagText}>AI Otopilot</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.posPnlCol}>
                        <Text style={[styles.posPnl, { color: isPosProfit ? Colors.bullish : Colors.bearish }]}>
                          {isPosProfit ? '+' : ''}${pos.pnl.toFixed(2)}
                        </Text>
                        <Text style={[styles.posPnlPercent, { color: isPosProfit ? Colors.bullish : Colors.bearish }]}>
                          {isPosProfit ? '+' : ''}{pos.pnlPercent.toFixed(2)}%
                        </Text>
                      </View>
                    </View>

                    <View style={styles.posGrid}>
                      <View style={styles.posGridItem}>
                        <Text style={styles.posGridLabel}>Giriş Fiyatı</Text>
                        <Text style={styles.posGridValue}>${pos.entryPrice.toLocaleString()}</Text>
                      </View>
                      <View style={styles.posGridItem}>
                        <Text style={styles.posGridLabel}>Güncel Fiyat</Text>
                        <Text style={styles.posGridValue}>${pos.currentPrice.toLocaleString()}</Text>
                      </View>
                      <View style={styles.posGridItem}>
                        <Text style={styles.posGridLabel}>Miktar</Text>
                        <Text style={styles.posGridValue}>{pos.amount} {pos.symbol}</Text>
                      </View>
                      <View style={styles.posGridItem}>
                        <Text style={styles.posGridLabel}>Toplam Değer</Text>
                        <Text style={styles.posGridValue}>${(pos.amount * pos.currentPrice).toFixed(2)}</Text>
                      </View>
                    </View>

                    {/* Targets footer */}
                    <View style={styles.targetsRow}>
                      <Text style={styles.triggerText}>
                        Hedef Kâr: <Text style={{ color: Colors.bullish }}>${pos.targetProfit.toLocaleString()}</Text>
                      </Text>
                      <Text style={styles.triggerText}>
                        Zarar Kes: <Text style={{ color: Colors.bearish }}>${pos.stopLoss.toLocaleString()}</Text>
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => handleClosePosition(pos.id, pos.symbol, pos.pnl)}
                      style={styles.closePosBtn}
                    >
                      <Text style={styles.closePosBtnText}>{t('close_position')}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* Trade History Tab */}
        {activeTab === 'history' && (
          <View style={styles.tabContent}>
            {tradeHistory.map((item) => {
              const isProfitHistory = item.pnl >= 0;
              return (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyTopRow}>
                    <View style={styles.historySymbolCol}>
                      <Text style={styles.historySymbol}>{item.symbol}</Text>
                      <Text style={styles.historyDate}>{item.closedAt} • {item.closedReason}</Text>
                    </View>
                    <View style={styles.historyPnlCol}>
                      <Text style={[styles.historyPnl, { color: isProfitHistory ? Colors.bullish : Colors.bearish }]}>
                        {isProfitHistory ? '+' : ''}${item.pnl.toFixed(2)}
                      </Text>
                      <Text style={[styles.historyPnlPercent, { color: isProfitHistory ? Colors.bullish : Colors.bearish }]}>
                        {isProfitHistory ? '+' : ''}{item.pnlPercent.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                  <View style={styles.historyPrices}>
                    <Text style={styles.historyPriceText}>Giriş: ${item.entryPrice.toLocaleString()}  ➔  Çıkış: ${item.closePrice.toLocaleString()}</Text>
                    {item.isAutopilot && (
                      <View style={styles.autopilotTagCompact}>
                        <Ionicons name="flash" size={9} color={Colors.primary} />
                        <Text style={styles.autopilotTagTextCompact}>Otopilot</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  balanceCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: Colors.cardBgElevated,
  },
  resetText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  pnlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  pnlBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pnlText: {
    fontSize: 12,
    fontWeight: '700',
  },
  pnlDuration: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  allocationSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  allocationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  allocationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  cashText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  allocationBarContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.cardBgElevated,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
  },
  allocationSegment: {
    height: '100%',
  },
  allocationLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchTab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 8,
  },
  switchTabActive: {
    backgroundColor: Colors.cardBgElevated,
  },
  switchTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  switchTabTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  tabContent: {
    gap: 12,
  },
  emptyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  posCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  posHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  posSymbolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  posSymbol: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  sideBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sideText: {
    fontSize: 10,
    fontWeight: '700',
  },
  autopilotTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  autopilotTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  posPnlCol: {
    alignItems: 'flex-end',
  },
  posPnl: {
    fontSize: 15,
    fontWeight: '700',
  },
  posPnlPercent: {
    fontSize: 11,
    fontWeight: '600',
  },
  posGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    gap: 10,
  },
  posGridItem: {
    width: '45%',
  },
  posGridLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  posGridValue: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  targetsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  triggerText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  closePosBtn: {
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 10,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  closePosBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.bearish,
  },
  historyCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  historySymbolCol: {},
  historySymbol: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historyDate: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  historyPnlCol: {
    alignItems: 'flex-end',
  },
  historyPnl: {
    fontSize: 14,
    fontWeight: '700',
  },
  historyPnlPercent: {
    fontSize: 11,
    fontWeight: '600',
  },
  historyPrices: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 6,
    marginTop: 4,
  },
  historyPriceText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  autopilotTagCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  autopilotTagTextCompact: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.primary,
  },
});
