import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Header, Input, Toggle, Button, Card } from '../../../shared/components';
import { useApp } from '../../../context/AppContext';
import { RootStackParamList } from '../../../navigation/navigation.types';

type RouteType = RouteProp<RootStackParamList, 'NewAlarm'>;

export const NewAlarmScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const { coins, createAlarm } = useApp();

  const symbol = route.params?.symbol || 'ETH';
  const coin = coins.find((c) => c.symbol === symbol) || coins[1];

  const [triggerType, setTriggerType] = useState<'price' | 'ai'>('price');
  const [targetPrice, setTargetPrice] = useState('2.600');
  const [condition, setCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [sendNotification, setSendNotification] = useState(true);
  const [autoSell, setAutoSell] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await createAlarm({
      symbol: coin.symbol,
      targetPrice: parseFloat(targetPrice.replace('.', '')) || 2600,
      condition,
      sendNotification,
      autoSellAutopilot: autoSell,
      sellPercentage: 25,
    });
    setIsSaving(false);
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <Header
        showBack
        onBackPress={() => navigation.goBack()}
        title="Yeni Alarm & Otopilot"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Varlık Başlığı */}
        <View style={styles.assetHeader}>
          <View style={[styles.assetCircle, { backgroundColor: coin.color }]}>
            <Text style={styles.assetLetter}>{coin.iconLetter}</Text>
          </View>
          <Text style={styles.assetTitle}>
            {coin.name} ({coin.symbol})
          </Text>
          <Text style={styles.currentPrice}>
            Güncel Fiyat: ${coin.priceUsd.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </Text>
        </View>

        {/* Tetikleyici Türü (Fiyat Eşiği vs AI Sinyali) */}
        <View style={styles.segmentedRow}>
          <Pressable
            style={[
              styles.segmentBtn,
              triggerType === 'price' && styles.segmentBtnActive,
            ]}
            onPress={() => setTriggerType('price')}
          >
            <Text
              style={[
                styles.segmentText,
                triggerType === 'price' && styles.segmentTextActive,
              ]}
            >
              Fiyat Eşiği
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.segmentBtn,
              triggerType === 'ai' && styles.segmentBtnActive,
            ]}
            onPress={() => setTriggerType('ai')}
          >
            <Text
              style={[
                styles.segmentText,
                triggerType === 'ai' && styles.segmentTextActive,
              ]}
            >
              AI Sinyali
            </Text>
          </Pressable>
        </View>

        {/* Hedef Fiyat Girişi */}
        <Input
          label="Hedef Fiyat ($)"
          value={targetPrice}
          onChangeText={setTargetPrice}
          keyboardType="numeric"
          badgeText="USDT"
        />

        {/* Koşul Seçimi */}
        <Text style={styles.fieldLabel}>Koşul</Text>
        <View style={styles.conditionRow}>
          <Pressable
            style={[
              styles.conditionBtn,
              condition === 'ABOVE' && styles.conditionBtnActive,
            ]}
            onPress={() => setCondition('ABOVE')}
          >
            <Text
              style={[
                styles.conditionText,
                condition === 'ABOVE' && styles.conditionTextActive,
              ]}
            >
              Üzerine Çıkarsa ↑
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.conditionBtn,
              condition === 'BELOW' && styles.conditionBtnActive,
            ]}
            onPress={() => setCondition('BELOW')}
          >
            <Text
              style={[
                styles.conditionText,
                condition === 'BELOW' && styles.conditionTextActive,
              ]}
            >
              Altına Düşerse ↓
            </Text>
          </Pressable>
        </View>

        {/* Aksiyonlar Bölümü */}
        <Text style={styles.fieldLabel}>Aksiyonlar</Text>

        <Card style={styles.actionCard}>
          <Text style={styles.actionTitle}>Anlık Bildirim Gönder</Text>
          <Toggle value={sendNotification} onValueChange={setSendNotification} />
        </Card>

        <Card style={styles.actionCard}>
          <View style={styles.actionLeftCol}>
            <Text style={styles.actionTitle}>Otomatik Sat (Otopilot)</Text>
            <Text style={styles.actionSubtitle}>
              Portföydeki {coin.symbol}'nin %25'ini sat
            </Text>
          </View>
          <Toggle value={autoSell} onValueChange={setAutoSell} />
        </Card>

        {/* Kaydet Butonu */}
        <Button
          title="Alarmı Kaydet"
          onPress={handleSave}
          loading={isSaving}
          style={styles.saveButton}
        />
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
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  assetHeader: {
    alignItems: 'center',
    marginVertical: spacing.lg,
  },
  assetCircle: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  assetLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 22,
  },
  assetTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  currentPrice: {
    ...typography.bodyBold,
    color: colors.success,
    marginTop: 4,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#10151E',
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: spacing.xl,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: borderRadius.sm + 2,
  },
  segmentBtnActive: {
    backgroundColor: colors.card,
  },
  segmentText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.textPrimary,
  },
  fieldLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  conditionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  conditionBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  conditionBtnActive: {
    borderColor: colors.primary,
    backgroundColor: '#0F1A28',
  },
  conditionText: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },
  conditionTextActive: {
    color: colors.primary,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  actionLeftCol: {
    flex: 1,
  },
  actionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  actionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
  saveButton: {
    marginTop: spacing.xl,
  },
});
