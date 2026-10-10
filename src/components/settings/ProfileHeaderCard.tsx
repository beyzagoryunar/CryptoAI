import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../../types/crypto';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  user: UserProfile | null;
}

export const ProfileHeaderCard: React.FC<Props> = ({ user }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.profileCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <View style={[styles.avatar, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
        <Text style={[styles.avatarText, { color: colors.primary }]}>
          {user ? user.name.slice(0, 2).toUpperCase() : 'AI'}
        </Text>
      </View>
      <View style={styles.profileDetails}>
        <Text style={[styles.userName, { color: colors.textPrimary }]}>
          {user ? user.name : 'Misafir Kullanıcı'}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {user ? user.email : 'Oturum açılmadı'}
        </Text>
        <View style={[styles.providerBadge, { backgroundColor: colors.cardBgElevated }]}>
          <Ionicons
            name={
              user?.authProvider === 'google'
                ? 'logo-google'
                : user?.authProvider === 'apple'
                ? 'logo-apple'
                : 'mail-outline'
            }
            size={12}
            color={colors.primary}
          />
          <Text style={[styles.providerText, { color: colors.textSecondary }]}>
            {user?.authProvider === 'google'
              ? 'Google OAuth 2.0 Doğrulandı'
              : user?.authProvider === 'apple'
              ? 'Apple Kimliği ile Giriş'
              : 'E-Posta & Şifreli Giriş'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    marginBottom: 6,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  providerText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
