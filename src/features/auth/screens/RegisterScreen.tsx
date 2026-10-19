import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Button, Input, Header } from '../../../shared/components';
import { useAuth } from '../../../context/AuthContext';
import { AuthStackParamList } from '../../../navigation/navigation.types';
import { PasswordCriteriaCard } from '../components/PasswordCriteriaCard';

type RegisterNavProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterNavProp>();
  const { register, isLoading } = useAuth();

  const [firstName, setFirstName] = useState('Ahmet');
  const [lastName, setLastName] = useState('Durmuş');
  const [email, setEmail] = useState('ahmetdurmus2005@gmail.com');
  const [password, setPassword] = useState('Password123!');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasMixedCase = /[a-z]/.test(password) && /[A-Z]/.test(password);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    if (!hasMinLength || !hasNumber || !hasMixedCase) {
      setError('Lütfen tüm şifre kriterlerini karşılayın.');
      return;
    }
    setError('');
    try {
      await register(firstName, lastName, email, password);
    } catch {
      setError('Kayıt oluşturulurken bir hata oluştu.');
    }
  };

  return (
    <View style={styles.screen}>
      <Header showBack onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            Yeni Hesap <Text style={styles.titleCyan}>Oluştur</Text>
          </Text>
          <Text style={styles.subtitle}>
            Aramıza katılın ve{' '}
            <Text style={styles.bonusGreen}>$10.000 Sanal Bakiye</Text> kazanın
          </Text>
        </View>

        <View style={styles.nameRow}>
          <View style={styles.halfInput}>
            <Input
              label="Ad"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ahmet"
              leftIcon={<User size={18} color={colors.textSecondary} />}
            />
          </View>
          <View style={styles.halfInput}>
            <Input
              label="Soyad"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Durmuş"
            />
          </View>
        </View>

        <Input
          label="E-Posta Adresi"
          value={email}
          onChangeText={setEmail}
          placeholder="ahmetdurmus2005@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={18} color={colors.textSecondary} />}
        />

        <Input
          label="Şifre"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={!showPassword}
          leftIcon={<Lock size={18} color={colors.primary} />}
          rightIcon={
            showPassword ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )
          }
          onRightIconPress={() => setShowPassword(!showPassword)}
        />

        <PasswordCriteriaCard
          hasMinLength={hasMinLength}
          hasNumber={hasNumber}
          hasMixedCase={hasMixedCase}
        />

        <Input
          label="Şifre (Tekrar)"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Şifrenizi tekrar girin"
          secureTextEntry={!showPassword}
          leftIcon={<Lock size={18} color={colors.textMuted} />}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          title="Hesap Oluştur"
          onPress={handleRegister}
          loading={isLoading}
          style={styles.submitButton}
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>veya şununla devam et</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.googleContainer}>
          <Pressable style={styles.googleCircleButton} onPress={handleRegister}>
            <Text style={styles.googleIconText}>G</Text>
          </Pressable>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Giriş Yapın</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  titleSection: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  titleCyan: {
    color: colors.primary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  bonusGreen: {
    color: colors.success,
    fontWeight: '700',
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#18202E',
  },
  dividerText: {
    ...typography.caption,
    color: colors.textMuted,
    marginHorizontal: spacing.md,
  },
  googleContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  googleCircleButton: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.md,
    backgroundColor: '#151D2A',
    borderWidth: 1,
    borderColor: '#243044',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  footerLink: {
    ...typography.bodyBold,
    color: colors.primary,
  },
});
