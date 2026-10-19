import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Bell, ChevronRight, Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Card, Toggle, Button } from '../../../shared/components';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';

export const ProfileScreen: React.FC = () => {
  const { user, logout, sessionDaysRemaining, sessionExpiryDate, refreshSession } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [autopilotPermission, setAutopilotPermission] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [sessionRefreshed, setSessionRefreshed] = useState(false);

  const handleRefreshSession = async () => {
    await refreshSession();
    setSessionRefreshed(true);
    setTimeout(() => setSessionRefreshed(false), 2500);
  };

  return (
    <View style={styles.screen}>
      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hesabım</Text>
        <Pressable style={styles.bellButton}>
          <Bell size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Kullanıcı Profil Kartı */}
        <Card style={styles.profileCard}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>BG</Text>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.nameText}>
                {user ? `${user.firstName} ${user.lastName}` : 'Beyza Göryunar'}
              </Text>
              <Text style={styles.uidText}>
                UID: {user?.uid || '231002035'}
              </Text>

              <View style={styles.verifiedBadge}>
                <Check size={12} color={colors.success} />
                <Text style={styles.verifiedText}>E-posta Doğrulandı</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Bölüm: FİNANSAL İŞLEMLER */}
        <Text style={styles.sectionHeader}>FİNANSAL İŞLEMLER</Text>
        <Card style={styles.menuCard}>
          <Pressable style={styles.menuRow}>
            <Text style={styles.menuLabel}>Banka Hesaplarım</Text>
            <View style={styles.menuValueRow}>
              <Text style={styles.menuValue}>2 Kayıtlı</Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.menuRow}>
            <Text style={styles.menuLabel}>Komisyon Oranları</Text>
            <View style={styles.menuValueRow}>
              <Text style={[styles.menuValue, { color: colors.success }]}>
                %0.08
              </Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </View>
          </Pressable>
        </Card>

        {/* Bölüm: YAPAY ZEKA VE OTOPİLOT */}
        <Text style={styles.sectionHeader}>YAPAY ZEKA VE OTOPİLOT</Text>
        <Card style={styles.menuCard}>
          <Pressable style={styles.menuRow}>
            <Text style={styles.menuLabel}>AI Risk Profili</Text>
            <View style={styles.menuValueRow}>
              <Text style={[styles.menuValue, { color: colors.primary }]}>
                Dengeli
              </Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </View>
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.menuRow}>
            <Text style={styles.menuLabel}>Otopilot İşlem İzni</Text>
            <Toggle
              value={autopilotPermission}
              onValueChange={setAutopilotPermission}
            />
          </View>
        </Card>

        {/* Bölüm: GÖRÜNÜM VE TEMA */}
        <Text style={styles.sectionHeader}>GÖRÜNÜM VE TEMA</Text>
        <Card style={styles.menuCard}>
          <View style={styles.menuRow}>
            <View>
              <Text style={styles.menuLabel}>Karanlık Mod (Dark Theme)</Text>
              <Text style={styles.subLabelText}>
                {isDark ? 'Karanlık tema aktif' : 'Açık tema aktif'}
              </Text>
            </View>
            <Toggle value={isDark} onValueChange={toggleTheme} />
          </View>
        </Card>

        {/* Bölüm: GÜVENLİK */}
        <Text style={styles.sectionHeader}>GÜVENLİK VE OTURUM</Text>
        <Card style={styles.menuCard}>
          <Pressable style={styles.menuRow} onPress={handleRefreshSession}>
            <View>
              <Text style={styles.menuLabel}>Oturum Süresi (Beni Hatırla)</Text>
              <Text style={styles.subLabelText}>
                Bitiş: {sessionExpiryDate} ({sessionDaysRemaining} gün kaldı)
              </Text>
            </View>
            <View style={styles.menuValueRow}>
              <Text style={[styles.menuValue, { color: sessionRefreshed ? colors.success : colors.primary }]}>
                {sessionRefreshed ? '✓ 30 Gün Uzatıldı' : '+30 Gün Uzat'}
              </Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.menuRow}>
            <Text style={styles.menuLabel}>Google Authenticator (2FA)</Text>
            <View style={styles.menuValueRow}>
              <Text style={[styles.menuValue, { color: colors.success }]}>
                Açık
              </Text>
              <ChevronRight size={16} color={colors.textSecondary} />
            </View>
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.menuRow}>
            <Text style={styles.menuLabel}>FaceID ile Giriş</Text>
            <Toggle value={faceIdEnabled} onValueChange={setFaceIdEnabled} />
          </View>
        </Card>

        {/* Çıkış Yap Butonu */}
        <Pressable
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutText}>Güvenli Çıkış Yap</Text>
        </Pressable>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  profileCard: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.full,
    backgroundColor: '#1C2738',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.h3,
    color: colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  nameText: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    fontSize: 16,
  },
  uidText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.pill,
    marginTop: 6,
  },
  verifiedText: {
    ...typography.micro,
    color: colors.success,
  },
  sectionHeader: {
    ...typography.micro,
    color: colors.textMuted,
    marginBottom: spacing.xs + 2,
    marginTop: spacing.sm,
  },
  menuCard: {
    padding: 0,
    marginBottom: spacing.md,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  menuLabel: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  menuValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  menuValue: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  subLabelText: {
    ...typography.micro,
    color: colors.textMuted,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#18202E',
    marginHorizontal: spacing.md,
  },
  logoutButton: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: '#242D3D',
  },
  logoutText: {
    ...typography.bodyBold,
    color: colors.danger,
    fontSize: 15,
  },
});
