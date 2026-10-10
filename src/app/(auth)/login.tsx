import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { AuthSocialButtons } from '../../components/auth/AuthSocialButtons';
import { authStyles as styles } from '../../styles/authStyles';

export default function LoginScreen() {
  const { loginWithEmail, loginWithGoogle, loginDemoUser } = useAuth();
  const { t } = useLanguage();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Eksik Bilgi', 'Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    setLoading(true);
    const res = await loginWithEmail(email, password);
    setLoading(false);
    if (res.success) {
      router.replace('/(tabs)');
    } else {
      showAlert('Giriş Başarısız', res.error || 'E-posta veya şifre hatalı.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      showAlert('Google Girişi', res.error);
    }
  };

  const handleAppleLogin = () => {
    showAlert(
      'Apple ile Giriş',
      'Apple Kimliği doğrulaması gerçek iOS cihaz sertifikası gerektirir. Lütfen gerçek Firebase doğrulaması için E-Posta ve Şifrenizle Kayıt Olup giriş yapın.'
    );
  };

  const handleDemoLogin = () => {
    loginDemoUser();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <View style={[styles.logoBadge, { backgroundColor: colors.cardBgElevated, borderColor: colors.primary }]}>
            <Ionicons name="hardware-chip-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            Crypto<Text style={{ color: colors.primary }}>AI</Text>
          </Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>{t('login_subtitle')}</Text>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.textPrimary }]}>{t('login_title')}</Text>

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('email')}</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary }]}
                placeholder="ornek@universite.edu.tr"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('password')}</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary }]}
                placeholder="Şifreniz"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleLogin}
            activeOpacity={0.8}
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            disabled={loading}
          >
            <Text style={[styles.submitBtnText, { color: colors.background }]}>{t('login_button')}</Text>
          </TouchableOpacity>

          {/* Demo Login Button */}
          <TouchableOpacity
            onPress={handleDemoLogin}
            activeOpacity={0.7}
            style={[styles.demoBtn, { borderColor: colors.primary, backgroundColor: colors.cardBgElevated }]}
          >
            <Ionicons name="flash-outline" size={16} color={colors.primary} />
            <Text style={[styles.demoBtnText, { color: colors.primary }]}>{t('demo_login_button')}</Text>
          </TouchableOpacity>

          {/* Social Logins */}
          <AuthSocialButtons onGooglePress={handleGoogleLogin} onApplePress={handleAppleLogin} />

          {/* Go to register */}
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.switchAuthBtn}>
            <Text style={[styles.switchAuthText, { color: colors.textSecondary }]}>{t('no_account')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
