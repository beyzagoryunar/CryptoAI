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

export default function RegisterScreen() {
  const { registerWithEmail, loginWithGoogle, loginWithApple } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Şifre Uyuşmazlığı', 'Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Zayıf Şifre', 'Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    setLoading(true);
    const res = await registerWithEmail(name, email, password);
    setLoading(false);
    if (res.success) {
      Alert.alert('Kayıt Başarılı', 'Firebase hesabınız oluşturuldu. $10.000 sanal bakiyeniz cüzdanınıza tanımlandı.');
      router.replace('/(tabs)');
    } else {
      Alert.alert('Kayıt Başarısız', res.error || 'Kayıt işlemi sırasında bir hata oluştu.');
    }
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const res = await loginWithGoogle();
    setLoading(false);
    if (res.success) {
      router.replace('/(tabs)');
    } else if (res.error) {
      Alert.alert('Google Girişi', res.error);
    }
  };

  const handleAppleSignup = async () => {
    Alert.alert(
      'Apple ile Kayıt',
      'Apple Kimliği doğrulaması gerçek iOS cihaz sertifikası gerektirir. Lütfen gerçek Firebase doğrulaması için E-Posta ve Şifrenizle Kayıt Olun.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.brandHeader}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.brandTitle}>Yeni Hesap Oluştur</Text>
          <Text style={styles.brandSubtitle}>Yapay zeka destekli sanal portföyünüzü hemen yönetin</Text>
        </View>

        <View style={styles.formCard}>
          {/* Name input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('name')}</Text>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Adınız ve Soyadınız"
                placeholderTextColor={Colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('email')}</Text>
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="eposta@adresiniz.com"
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('password')}</Text>
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="En az 6 karakter"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Şifre Tekrar</Text>
            <View style={styles.inputBox}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Şifrenizi tekrar girin"
                placeholderTextColor={Colors.textMuted}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleRegister}
            activeOpacity={0.8}
            style={styles.submitBtn}
            disabled={loading}
          >
            <Text style={styles.submitBtnText}>{t('register_button')}</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('or_continue_with')}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social */}
          <View style={styles.socialButtonsRow}>
            <TouchableOpacity onPress={handleGoogleSignup} style={styles.socialBtn}>
              <Ionicons name="logo-google" size={18} color="#EA4335" />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAppleSignup} style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={18} color="#FFFFFF" />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Back to login */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.switchAuthBtn}
          >
            <Text style={styles.switchAuthText}>{t('have_account')}</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  formCard: {
    backgroundColor: Colors.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputGroup: {
    marginBottom: 12,
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
    paddingVertical: 10,
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
    marginBottom: 14,
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
    marginBottom: 16,
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
  switchAuthBtn: {
    alignItems: 'center',
  },
  switchAuthText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});
