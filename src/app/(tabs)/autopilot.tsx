import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { Header } from '../../components/Header';
import { useAutopilot } from '../../context/AutopilotContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function AutopilotScreen() {
  const { config, logs, toggleAutopilot, updateConfig, clearLogs } = useAutopilot();
  const { t } = useLanguage();

  const tradeRatioOptions = [0.10, 0.15, 0.20, 0.25];
  const maxPositionsOptions = [2, 3, 4, 5];
  const minConfidenceOptions = [70, 75, 80, 85];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Master Autopilot Switch Banner */}
        <View style={[styles.masterCard, config.enabled ? styles.masterCardActive : styles.masterCardInactive]}>
          <View style={styles.masterTop}>
            <View style={styles.masterInfo}>
              <View style={styles.badgeRow}>
                <View style={[styles.statusDot, { backgroundColor: config.enabled ? Colors.bullish : Colors.bearish }]} />
                <Text style={[styles.statusText, { color: config.enabled ? Colors.bullish : Colors.bearish }]}>
                  {config.enabled ? t('autopilot_active') : t('autopilot_inactive')}
                </Text>
              </View>
              <Text style={styles.masterTitle}>{t('autopilot_title')}</Text>
              <Text style={styles.masterDesc}>{t('autopilot_desc')}</Text>
            </View>
            <Switch
              value={config.enabled}
              onValueChange={toggleAutopilot}
              trackColor={{ false: Colors.border, true: Colors.bullish }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Architecture Architecture Badge */}
          <View style={styles.archBadge}>
            <Ionicons name="git-network-outline" size={14} color={Colors.primary} />
            <Text style={styles.archText}>
              Python FastAPI (AI) ➔ C# ASP.NET Core (BackgroundService) ➔ SignalR Dağıtım
            </Text>
          </View>
        </View>

        {/* Risk Management Parameters */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="options-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{t('risk_settings')}</Text>
          </View>

          {/* 1. Max Balance Ratio per trade */}
          <View style={styles.settingBlock}>
            <View style={styles.settingLabelRow}>
              <Text style={styles.settingLabel}>{t('max_trade_ratio')}</Text>
              <Text style={styles.settingValue}>%{Math.round(config.maxTradeRatio * 100)}</Text>
            </View>
            <View style={styles.optionsRow}>
              {tradeRatioOptions.map((ratio) => (
                <TouchableOpacity
                  key={ratio}
                  onPress={() => updateConfig({ maxTradeRatio: ratio })}
                  style={[styles.optionPill, config.maxTradeRatio === ratio && styles.optionPillActive]}
                >
                  <Text style={[styles.optionText, config.maxTradeRatio === ratio && styles.optionTextActive]}>
                    %{Math.round(ratio * 100)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 2. Max Open Positions */}
          <View style={styles.settingBlock}>
            <View style={styles.settingLabelRow}>
              <Text style={styles.settingLabel}>{t('max_positions')}</Text>
              <Text style={styles.settingValue}>{config.maxOpenPositions} Pozisyon</Text>
            </View>
            <View style={styles.optionsRow}>
              {maxPositionsOptions.map((count) => (
                <TouchableOpacity
                  key={count}
                  onPress={() => updateConfig({ maxOpenPositions: count })}
                  style={[styles.optionPill, config.maxOpenPositions === count && styles.optionPillActive]}
                >
                  <Text style={[styles.optionText, config.maxOpenPositions === count && styles.optionTextActive]}>
                    {count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3. Minimum Confidence Threshold */}
          <View style={styles.settingBlock}>
            <View style={styles.settingLabelRow}>
              <Text style={styles.settingLabel}>{t('min_confidence')}</Text>
              <Text style={styles.settingValue}>%{config.minConfidence}</Text>
            </View>
            <View style={styles.optionsRow}>
              {minConfidenceOptions.map((conf) => (
                <TouchableOpacity
                  key={conf}
                  onPress={() => updateConfig({ minConfidence: conf })}
                  style={[styles.optionPill, config.minConfidence === conf && styles.optionPillActive]}
                >
                  <Text style={[styles.optionText, config.minConfidence === conf && styles.optionTextActive]}>
                    %{conf}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 4. Auto Take-Profit & Stop-Loss */}
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Otomatik Kâr Al (Take-Profit)</Text>
              <Text style={styles.switchSublabel}>Hedef fiyata ulaşıldığında kârı realize et</Text>
            </View>
            <Switch
              value={config.autoTakeProfit}
              onValueChange={(val) => updateConfig({ autoTakeProfit: val })}
              trackColor={{ false: Colors.border, true: Colors.bullish }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
            <View>
              <Text style={styles.switchLabel}>Otomatik Zarar Kes (Stop-Loss)</Text>
              <Text style={styles.switchSublabel}>Risk sınırına ulaşıldığında sermayeyi koru</Text>
            </View>
            <Switch
              value={config.autoStopLoss}
              onValueChange={(val) => updateConfig({ autoStopLoss: val })}
              trackColor={{ false: Colors.border, true: Colors.bullish }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Live Activity Logs */}
        <View style={styles.sectionCard}>
          <View style={styles.logHeader}>
            <View style={styles.logHeaderLeft}>
              <Ionicons name="terminal-outline" size={16} color={Colors.primary} />
              <Text style={styles.sectionTitle}>{t('live_activity_logs')}</Text>
            </View>
            <TouchableOpacity onPress={clearLogs}>
              <Text style={styles.clearLogsText}>Temizle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.logsContainer}>
            {logs.map((log) => {
              const getIcon = () => {
                if (log.type === 'trade') return { name: 'flash' as const, color: Colors.primary };
                if (log.type === 'profit') return { name: 'arrow-up-circle' as const, color: Colors.bullish };
                if (log.type === 'loss') return { name: 'alert-circle' as const, color: Colors.bearish };
                return { name: 'information-circle-outline' as const, color: Colors.textMuted };
              };
              const icon = getIcon();

              return (
                <View key={log.id} style={styles.logRow}>
                  <Ionicons name={icon.name} size={14} color={icon.color} style={{ marginTop: 2 }} />
                  <View style={styles.logContent}>
                    <Text style={styles.logTime}>{log.time}</Text>
                    <Text style={styles.logMsg}>{log.message}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
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
  masterCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    marginBottom: 16,
  },
  masterCardActive: {
    backgroundColor: 'rgba(0, 230, 118, 0.05)',
    borderColor: 'rgba(0, 230, 118, 0.3)',
  },
  masterCardInactive: {
    backgroundColor: Colors.cardBg,
    borderColor: Colors.border,
  },
  masterTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  masterInfo: {
    flex: 1,
    paddingRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  masterTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  masterDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  archBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  archText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  sectionCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  settingBlock: {
    marginBottom: 16,
  },
  settingLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  settingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionPill: {
    flex: 1,
    backgroundColor: Colors.cardBgElevated,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionPillActive: {
    backgroundColor: Colors.primaryMuted,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  optionTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  switchSublabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearLogsText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  logsContainer: {
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 260,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 10,
  },
  logContent: {
    flex: 1,
  },
  logTime: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: undefined,
  },
  logMsg: {
    fontSize: 11,
    color: Colors.textPrimary,
    lineHeight: 16,
    marginTop: 1,
  },
});
