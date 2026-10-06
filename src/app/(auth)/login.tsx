import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const { loginWithEmail, loginWithGoogle, loginWithApple, loginDemoUser } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    setLoading(true);
    const res = await loginWithEmail(email, password);
    setLoading(false);
    if (res.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Giriş Başarısız', res.error || 'E-posta veya şifre hatalı.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      Alert.alert('Google Girişi', res.error);
    }
  };

  const handleAppleLogin = async () => {
    Alert.alert(
      'Apple ile Giriş',
      'Apple Kimliği doğrulaması gerçek iOS cihaz sertifikası gerektirir. Lütfen gerçek Firebase doğrulaması için E-Posta ve Şifrenizle Kayıt Olup giriş yapın.'
    );
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={styles.logoBadge}>
            <Ionicons name="hardware-chip-outline" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.brandTitle}>Crypto<Text style={{ color: Colors.primary }}>AI</Text></Text>
          <Text style={styles.brandSubtitle}>{t('login_subtitle')}</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>{t('login_title')}</Text>

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('email')}</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="ornek@universite.edu.tr"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('password')}</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Şifreniz"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.8}
            style={styles.submitBtn}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>{t('login_button')}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('or_continue_with')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Logins */}
          <View style={styles.socialButtonsRow}>
            <TouchableOpacity onPress={handleGoogleLogin} style={styles.socialBtn}>
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAppleLogin} style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={18} color="#FFFFFF" />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Demo Access (For Presentation / Evaluation) */}
          <TouchableOpacity onPress={handleDemoLogin} style={styles.demoBtn}>
            <Ionicons name="flash-outline" size={16} color={Colors.primary} />
            <Text style={styles.demoBtnText}>{t('demo_login')}</Text>
          </TouchableOpacity>

          {/* Go to register */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            style={styles.switchAuthBtn}
          >
            <Text style={styles.switchAuthText}>{t('no_account')}</Text>
          </TouchableOpacity>
        </View>

        {/* Security badge footer */}
        <View style={styles.securityFooter}>
          <Ionicons name="shield-checkmark" size={14} color={Colors.bullish} />
          <Text style={styles.securityText}>JWT Token Tabanlı Güvenli Oturum & Şifreli Veri İletimi</Text>
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
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.cardBgElevated,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 18,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
    fontWeight: '600',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  submitBtnText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 11,
    color: Colors.textMuted,
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
    backgroundColor: Colors.cardBgElevated,
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  demoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primaryMuted,
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: 'rgba(0, 216, 246, 0.3)',
    marginBottom: 16,
  },
  demoBtnText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  switchAuthBtn: {
    alignItems: 'center',
  },
  switchAuthText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  securityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  securityText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
