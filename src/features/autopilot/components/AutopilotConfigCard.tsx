import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Sliders, Shield, TrendingUp } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Card } from '../../../shared/components/Card';
import { useApp, RiskProfileType } from '../../../context/AppContext';

export const AutopilotConfigCard: React.FC = () => {
  const { autopilotSettings, updateAutopilotSettings } = useApp();

  const riskProfiles: RiskProfileType[] = ['Muhafazakar', 'Dengeli', 'Agresif'];
  const stopLossOptions = [5, 10, 15];
  const takeProfitOptions = [10, 20, 30];

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Sliders size={18} color={colors.primary} />
          <Text style={styles.cardTitle}>Otopilot Strateji Ayarları</Text>
        </View>
        <Text style={styles.activeRiskBadge}>{autopilotSettings.riskProfile}</Text>
      </View>

      {/* Risk Profili Seçimi */}
      <Text style={styles.label}>Risk Profili</Text>
      <View style={styles.chipRow}>
        {riskProfiles.map((profile) => {
          const isActive = autopilotSettings.riskProfile === profile;
          return (
            <Pressable
              key={profile}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => updateAutopilotSettings({ riskProfile: profile })}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {profile}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Otomatik Stop-Loss */}
      <View style={styles.labelRow}>
        <View style={styles.labelWithIcon}>
          <Shield size={14} color={colors.danger} />
          <Text style={styles.label}>Otomatik Zarar-Kes (Stop-Loss)</Text>
        </View>
        <Text style={styles.valueHighlight}>-%{autopilotSettings.stopLossPercent}</Text>
      </View>
      <View style={styles.chipRow}>
        {stopLossOptions.map((pct) => {
          const isActive = autopilotSettings.stopLossPercent === pct;
          return (
            <Pressable
              key={pct}
              style={[styles.chip, isActive && styles.chipStopActive]}
              onPress={() => updateAutopilotSettings({ stopLossPercent: pct })}
            >
              <Text style={[styles.chipText, isActive && styles.chipStopText]}>
                -%{pct}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Hedef Kâr Alma */}
      <View style={styles.labelRow}>
        <View style={styles.labelWithIcon}>
          <TrendingUp size={14} color={colors.success} />
          <Text style={styles.label}>Hedef Kâr Alma (Take-Profit)</Text>
        </View>
        <Text style={[styles.valueHighlight, { color: colors.success }]}>
          +%{autopilotSettings.takeProfitPercent}
        </Text>
      </View>
      <View style={styles.chipRow}>
        {takeProfitOptions.map((pct) => {
          const isActive = autopilotSettings.takeProfitPercent === pct;
          return (
            <Pressable
              key={pct}
              style={[styles.chip, isActive && styles.chipProfitActive]}
              onPress={() => updateAutopilotSettings({ takeProfitPercent: pct })}
            >
              <Text style={[styles.chipText, isActive && styles.chipProfitText]}>
                +%{pct}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    marginBottom: spacing.xl,
    backgroundColor: '#0E1624',
    borderColor: '#1D2A3D',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  activeRiskBadge: {
    ...typography.captionBold,
    color: colors.primary,
    backgroundColor: 'rgba(0, 178, 254, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  label: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  valueHighlight: {
    ...typography.captionBold,
    color: colors.danger,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: '#0F1E32',
  },
  chipText: {
    ...typography.captionBold,
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primary,
  },
  chipStopActive: {
    borderColor: colors.danger,
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
  },
  chipStopText: {
    color: colors.danger,
  },
  chipProfitActive: {
    borderColor: colors.success,
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  chipProfitText: {
    color: colors.success,
  },
});
