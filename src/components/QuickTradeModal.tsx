import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { CryptoAsset } from '../types/crypto';
import { usePortfolio } from '../context/PortfolioContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface QuickTradeModalProps {
  visible: boolean;
  onClose: () => void;
  coin: CryptoAsset;
}

export const QuickTradeModal: React.FC<QuickTradeModalProps> = ({ visible, onClose, coin }) => {
  const { cashBalance, openPosition } = usePortfolio();
  const { colors } = useTheme();
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [amountStr, setAmountStr] = useState<string>('500');

  const amountUsd = parseFloat(amountStr) || 0;
  const coinQuantity = coin.price > 0 ? (amountUsd / coin.price).toFixed(4) : '0';

  const handleSelectPreset = (value: number) => {
    setAmountStr(value.toString());
  };

  const handleExecute = () => {
    if (amountUsd <= 0) {
      if (Platform.OS === 'web') {
        window.alert('Lütfen 0 dan büyük bir işlem tutarı girin.');
      } else {
        Alert.alert('Geçersiz Tutar', 'Lütfen 0 dan büyük bir işlem tutarı girin.');
      }
      return;
    }
    if (amountUsd > cashBalance) {
      const msg = `Mevcut nakit bakiyeniz: $${cashBalance.toFixed(2)}`;
      if (Platform.OS === 'web') {
        window.alert(`Yetersiz Bakiye\n${msg}`);
      } else {
        Alert.alert('Yetersiz Bakiye', msg);
      }
      return;
    }

    const success = openPosition(coin.symbol, side, amountUsd, false);
    if (success) {
      const msg = `${coin.symbol} için $${amountUsd} tutarında ${side === 'BUY' ? 'Alım' : 'Satış'} pozisyonu açıldı.`;
      if (Platform.OS === 'web') {
        window.alert(`Sanal Emir Gerçekleşti\n${msg}`);
      } else {
        Alert.alert('Sanal Emir Gerçekleşti', msg);
      }
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.modalBg, borderTopColor: colors.border }]}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Sanal İşlem Emri</Text>
              <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
                {coin.name} ({coin.symbol}) • Anlık: ${coin.price.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.cardBgElevated }]}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Buy / Sell Tabs */}
          <View style={[styles.sideSelector, { backgroundColor: colors.cardBgElevated }]}>
            <TouchableOpacity
              onPress={() => setSide('BUY')}
              style={[
                styles.sideTab,
                side === 'BUY' && { backgroundColor: colors.bullish },
              ]}
            >
              <Text style={[styles.sideTabText, { color: side === 'BUY' ? '#FFFFFF' : colors.textSecondary }]}>
                AL (BUY)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSide('SELL')}
              style={[
                styles.sideTab,
                side === 'SELL' && { backgroundColor: colors.bearish },
              ]}
            >
              <Text style={[styles.sideTabText, { color: side === 'SELL' ? '#FFFFFF' : colors.textSecondary }]}>
                SAT (SELL)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Balance info */}
          <View style={styles.balanceInfo}>
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Kullanılabilir Sanal Bakiye:</Text>
            <Text style={[styles.balanceValue, { color: colors.bullish }]}>
              ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </Text>
          </View>

          {/* Amount input */}
          <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]}>
            <Text style={[styles.inputPrefix, { color: colors.textMuted }]}>$</Text>
            <TextInput
              style={[styles.textInput, { color: colors.textPrimary }]}
              keyboardType="numeric"
              value={amountStr}
              onChangeText={setAmountStr}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={[styles.inputSuffix, { color: colors.textMuted }]}>USD</Text>
          </View>

          <Text style={[styles.approxQty, { color: colors.textMuted }]}>≈ {coinQuantity} {coin.symbol}</Text>

          {/* Presets */}
          <View style={styles.presetsRow}>
            {[100, 250, 500, 1000].map((val) => {
              const active = amountStr === val.toString();
              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => handleSelectPreset(val)}
                  style={[
                    styles.presetBtn,
                    {
                      backgroundColor: active ? colors.primaryMuted : colors.cardBgElevated,
                      borderColor: active ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text style={[styles.presetText, { color: active ? colors.primary : colors.textSecondary }]}>
                    ${val}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => handleSelectPreset(Math.floor(cashBalance * 0.25))}
              style={[styles.presetBtn, { backgroundColor: colors.cardBgElevated, borderColor: colors.border }]}
            >
              <Text style={[styles.presetText, { color: colors.textSecondary }]}>%25</Text>
            </TouchableOpacity>
          </View>

          {/* AI Signal Recommendation note */}
          <View style={[styles.aiHintBox, { backgroundColor: colors.primaryMuted, borderColor: colors.primary }]}>
            <Ionicons name="sparkles" size={14} color={colors.primary} />
            <Text style={[styles.aiHintText, { color: colors.textPrimary }]}>
              Yapay Zeka Sinyali: <Text style={{ fontWeight: '700', color: colors.primary }}>{coin.signal.action}</Text> (Güven: %{coin.signal.confidence})
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleExecute}
            activeOpacity={0.8}
            style={[styles.submitButton, { backgroundColor: side === 'BUY' ? colors.bullish : colors.bearish }]}
          >
            <Text style={styles.submitButtonText}>
              {side === 'BUY' ? 'Sanal Alım Yap' : 'Sanal Satış Emri Ver'} (${amountUsd})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  sideTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  sideTabText: {
    fontSize: 12,
    fontWeight: '700',
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
  },
  balanceValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputPrefix: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  inputSuffix: {
    fontSize: 12,
    fontWeight: '700',
  },
  approxQty: {
    fontSize: 11,
    marginTop: 6,
    marginBottom: 12,
    textAlign: 'right',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
  },
  aiHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  aiHintText: {
    fontSize: 11,
  },
  submitButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
