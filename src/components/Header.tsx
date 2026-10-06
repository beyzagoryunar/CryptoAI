import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr');
  };

  const handleProfilePress = () => {
    router.push('/(tabs)/settings');
  };

  return (
    <View style={styles.header}>
      {/* Brand & Status */}
      <View style={styles.brandContainer}>
        <View style={styles.logoRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.brandName}>Crypto<Text style={styles.brandAccent}>AI</Text></Text>
          <View style={styles.tag}>
            <Text style={styles.tagText}>SDK 57</Text>
          </View>
        </View>
        <Text style={styles.subtext}>Karar Destek & Otopilot Sistemi</Text>
      </View>

      {/* Actions: Language & User */}
      <View style={styles.actionsContainer}>
        {/* Language switch */}
        <TouchableOpacity onPress={toggleLanguage} style={styles.langBtn}>
          <Ionicons name="globe-outline" size={14} color={Colors.primary} />
          <Text style={styles.langText}>{language.toUpperCase()}</Text>
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity onPress={handleProfilePress} style={styles.avatarBtn}>
          <Text style={styles.avatarText}>
            {user ? user.name.slice(0, 2).toUpperCase() : 'AI'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  brandContainer: {
    flex: 1,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bullish,
  },
  brandName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandAccent: {
    color: Colors.primary,
  },
  tag: {
    backgroundColor: Colors.cardBgElevated,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  subtext: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.cardBgElevated,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  avatarBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryMuted,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
});
