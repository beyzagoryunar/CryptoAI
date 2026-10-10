import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../types/crypto';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  user: UserProfile | null;
  onToggleBiometrics: () => void;
}

export const SecuritySettingsCard: React.FC<Props> = ({ user, onToggleBiometrics }) => {
  const { t } = useLanguage();
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>{t('security')}</Text>
      </View>

      <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{t('biometric_login')}</Text>
          <Text style={[styles.rowDesc, { color: colors.textMuted }]}>
            FaceID veya Parmak İzi ile güvenli geçiş
          </Text>
        </View>
        <Switch
          value={user?.isBiometricEnabled || false}
          onValueChange={onToggleBiometrics}
          trackColor={{ false: colors.border, true: colors.bullish }}
          thumbColor="#FFFFFF"
        />
      </View>

      <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={[styles.rowLabel, { color: colors.textPrimary }]}>{t('jwt_status')}</Text>
          <Text style={[styles.tokenCode, { color: colors.primary }]} numberOfLines={1}>
            {user ? user.token : 'Geçerli token yok'}
          </Text>
        </View>
        <View style={[styles.verifiedBadge, { backgroundColor: colors.bullishMuted }]}>
          <Ionicons name="checkmark-done" size={12} color={colors.bullish} />
          <Text style={[styles.verifiedText, { color: colors.bullish }]}>Aktif</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 11,
  },
  tokenCode: {
    fontSize: 11,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
