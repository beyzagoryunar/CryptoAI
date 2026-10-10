import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

interface Props {
  onGooglePress: () => void;
  onApplePress: () => void;
}

export const AuthSocialButtons: React.FC<Props> = ({ onGooglePress, onApplePress }) => {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <>
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
        <Text style={[styles.dividerText, { color: colors.textMuted }]}>{t('or_continue_with')}</Text>
        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      </View>

      <View style={styles.socialButtonsRow}>
        <TouchableOpacity
          onPress={onGooglePress}
          style={[styles.socialBtn, { backgroundColor: colors.cardBgElevated, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-google" size={18} color="#EA4335" />
          <Text style={[styles.socialBtnText, { color: colors.textPrimary }]}>Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onApplePress}
          style={[styles.socialBtn, { backgroundColor: colors.cardBgElevated, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-apple" size={18} color={colors.textPrimary} />
          <Text style={[styles.socialBtnText, { color: colors.textPrimary }]}>Apple</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    marginHorizontal: 10,
  },
  socialButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1,
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
