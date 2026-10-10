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

export default function RegisterScreen() {
  const { registerWithEmail, loginWithGoogle } = useAuth();
  const { t } = useLanguage();
  const { colors } = useTheme();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showAlert = (title: string, msg: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}\n${msg}`);
    } else {
      Alert.alert(title, msg);
    }
  };

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim() || !email || !password) {
      showAlert('Eksik Bilgi', 'Lütfen ad, soyad ve tüm alanları doldurun.');
      return;
    }
    if (password !== confirmPassword) {
      showAlert('Şifre Uyuşmazlığı', 'Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      showAlert('Zayıf Şifre', 'Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    setLoading(true);
    const res = await registerWithEmail(firstName, lastName, email, password);
    setLoading(false);
    if (res.success) {
      showAlert('Kayıt Başarılı', 'Firebase hesabınız oluşturuldu. $10.000 sanal bakiyeniz cüzdanınıza tanımlandı.');
      router.replace('/(tabs)');
    } else {
      showAlert('Kayıt Başarısız', res.error || 'Kayıt işlemi sırasında bir hata oluştu.');
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      showAlert('Google Girişi', res.error);
    }
  };

  const handleAppleSignup = () => {
    showAlert(
      'Apple ile Kayıt',
      'Apple Kimliği doğrulaması gerçek iOS cihaz sertifikası gerektirir. Lütfen gerçek Firebase doğrulaması için E-Posta ve Şifrenizle Kayıt Olup giriş yapın.'
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.brandHeader}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.cardBgElevated, borderColor: colors.border }]}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.brandTitle, { color: colors.textPrimary }]}>
            Yeni Hesap <Text style={{ color: colors.primary }}>Oluştur</Text>
          </Text>
          <Text style={[styles.brandSubtitle, { color: colors.textSecondary }]}>
            {t('register_subtitle')} • Anında $10.000 Sanal Bakiye
          </Text>
        </View>

        {/* Form Card */}
        <View style={[styles.formCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: colors.textPrimary }]}>{t('register_title')}</Text>

          {/* First Name & Last Name inputs */}
          <View style={styles.nameRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Ad</Text>
              <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <Ionicons name="person-outline" size={16} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="Adınız"
                  placeholderTextColor={colors.textMuted}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Soyad</Text>
              <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
                <TextInput
                  style={[styles.textInput, { color: colors.textPrimary }]}
                  placeholder="Soyadınız"
                  placeholderTextColor={colors.textMuted}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>
          </View>

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
                placeholder="En az 6 karakter"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Confirm Password input */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{t('confirm_password')}</Text>
            <View style={[styles.inputBox, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary }]}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.8}
            style={[styles.submitBtn, { backgroundColor: colors.primary }]}
            disabled={loading}
          >
            <Text style={[styles.submitBtnText, { color: colors.background }]}>{t('register_button')}</Text>
          </TouchableOpacity>

          {/* Social Logins */}
          <AuthSocialButtons onGooglePress={handleGoogleSignup} onApplePress={handleAppleSignup} />

          {/* Go to login */}
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.switchAuthBtn}>
            <Text style={[styles.switchAuthText, { color: colors.textSecondary }]}>{t('has_account')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
