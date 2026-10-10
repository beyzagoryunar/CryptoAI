import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { Header } from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { user, logout, toggleBiometrics, loginDemoUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = typeof window !== 'undefined' ? window.confirm('Oturumu kapatıp giriş ekranına dönmek istiyor musunuz?') : true;
      if (confirmLogout) {
        await logout();
        router.replace('/(auth)/login');
      }
      return;
    }

    Alert.alert(
      t('logout'),
      'Oturumu kapatıp giriş ekranına dönmek istiyor musunuz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: t('logout'),
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? user.name.slice(0, 2).toUpperCase() : 'AI'}
            </Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{user ? user.name : 'Misafir Kullanıcı'}</Text>
            <Text style={styles.userEmail}>{user ? user.email : 'Oturum açılmadı'}</Text>
            <View style={styles.providerBadge}>
              <Ionicons
                name={
                  user?.authProvider === 'google'
                    ? 'logo-google'
                    : user?.authProvider === 'apple'
                    ? 'logo-apple'
                    : 'mail-outline'
                }
                size={12}
                color={Colors.primary}
              />
              <Text style={styles.providerText}>
                {user?.authProvider === 'google'
                  ? 'Google OAuth 2.0 Doğrulandı'
                  : user?.authProvider === 'apple'
                  ? 'Apple Kimliği ile Giriş'
                  : 'E-Posta & Şifreli Giriş'}
              </Text>
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{t('security')}</Text>
          </View>

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.rowLabel}>{t('biometric_login')}</Text>
              <Text style={styles.rowDesc}>FaceID veya Parmak İzi ile güvenli geçiş</Text>
            </View>
            <Switch
              value={user?.isBiometricEnabled || false}
              onValueChange={toggleBiometrics}
              trackColor={{ false: Colors.border, true: Colors.bullish }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.rowLabel}>{t('jwt_status')}</Text>
              <Text style={styles.tokenCode} numberOfLines={1}>
                {user ? user.token : 'Geçerli token yok'}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-done" size={12} color={Colors.bullish} />
              <Text style={styles.verifiedText}>Aktif</Text>
            </View>
          </View>
        </View>

        {/* Language Selection */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{t('app_language')}</Text>
          </View>
          <View style={styles.langSelectorRow}>
            <TouchableOpacity
              onPress={() => setLanguage('tr')}
              style={[styles.langOption, language === 'tr' && styles.langOptionActive]}
            >
              <Text style={[styles.langOptionText, language === 'tr' && styles.langOptionTextActive]}>
                🇹🇷 Türkçe (Varsayılan)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setLanguage('en')}
              style={[styles.langOption, language === 'en' && styles.langOptionActive]}
            >
              <Text style={[styles.langOptionText, language === 'en' && styles.langOptionTextActive]}>
                🇬🇧 English (Global)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Academic Bitirme Projesi Details */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="school-outline" size={18} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{t('academic_info')}</Text>
          </View>
          <Text style={styles.academicLead}>
            Yapay Zeka Destekli Kripto Para Karar Destek ve Otopilot Portföy Simülasyon Sistemi
          </Text>

          <View style={styles.academicGrid}>
            <View style={styles.academicItem}>
              <Text style={styles.academicLabel}>Veri Kaynakları</Text>
              <Text style={styles.academicVal}>Binance WebSocket, Yahoo Finance, Kaggle</Text>
            </View>
            <View style={styles.academicItem}>
              <Text style={styles.academicLabel}>Makine Öğrenmesi</Text>
              <Text style={styles.academicVal}>XGBoost & LightGBM Sınıflandırıcılar</Text>
            </View>
            <View style={styles.academicItem}>
              <Text style={styles.academicLabel}>Duygu Analizi (NLP)</Text>
              <Text style={styles.academicVal}>Kripto Haber & Korku/Açgözlülük İndeksi</Text>
            </View>
            <View style={styles.academicItem}>
              <Text style={styles.academicLabel}>Backend & Servisler</Text>
              <Text style={styles.academicVal}>ASP.NET Core C#, Python FastAPI, SignalR</Text>
            </View>
          </View>
        </View>

        {/* Demo Fast Account Switch */}
        <TouchableOpacity onPress={loginDemoUser} style={styles.demoSwitchBtn}>
          <Ionicons name="sparkles" size={16} color={Colors.primary} />
          <Text style={styles.demoSwitchText}>Demo Değerlendirme Hesabını Yükle</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={Colors.bearish} />
          <Text style={styles.logoutBtnText}>{t('logout')}</Text>
        </TouchableOpacity>
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
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  profileDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  providerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.cardBgElevated,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  providerText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
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
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  rowDesc: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  tokenCode: {
    fontSize: 11,
    color: Colors.primary,
    fontFamily: undefined,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.bullishMuted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.bullish,
  },
  langSelectorRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langOption: {
    flex: 1,
    backgroundColor: Colors.cardBgElevated,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langOptionActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  langOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  langOptionTextActive: {
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  academicLead: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    lineHeight: 18,
  },
  academicGrid: {
    gap: 10,
  },
  academicItem: {
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  academicLabel: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  academicVal: {
    fontSize: 12,
    color: Colors.textPrimary,
  },
  demoSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.cardBgElevated,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  demoSwitchText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.bearishMuted,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.3)',
  },
  logoutBtnText: {
    color: Colors.bearish,
    fontSize: 14,
    fontWeight: '700',
  },
});
