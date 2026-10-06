import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { CryptoAsset } from '../types/crypto';
import { Colors } from '../constants/theme';
import { usePortfolio } from '../context/PortfolioContext';
import { Ionicons } from '@expo/vector-icons';

interface QuickTradeModalProps {
  visible: boolean;
  onClose: () => void;
  coin: CryptoAsset;
}

export const QuickTradeModal: React.FC<QuickTradeModalProps> = ({ visible, onClose, coin }) => {
  const { cashBalance, openPosition } = usePortfolio();
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [amountStr, setAmountStr] = useState<string>('500');

  const amountUsd = parseFloat(amountStr) || 0;
  const coinQuantity = coin.price > 0 ? (amountUsd / coin.price).toFixed(4) : '0';

  const handleSelectPreset = (value: number) => {
    setAmountStr(value.toString());
  };

  const handleExecute = () => {
    if (amountUsd <= 0) {
      Alert.alert('Geçersiz Tutar', 'Lütfen 0 dan büyük bir işlem tutarı girin.');
      return;
    }
    if (amountUsd > cashBalance) {
      Alert.alert('Yetersiz Bakiye', `Mevcut nakit bakiyeniz: $${cashBalance.toFixed(2)}`);
      return;
    }

    const success = openPosition(coin.symbol, side, amountUsd, false);
    if (success) {
      Alert.alert(
        'Sanal Emir Gerçekleşti',
        `${coin.symbol} için $${amountUsd} tutarında ${side === 'BUY' ? 'Alım' : 'Satış'} pozisyonu açıldı.`
      );
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.modalTitle}>Sanal İşlem Emri</Text>
              <Text style={styles.modalSubtitle}>{coin.name} ({coin.symbol}) • Anlık: ${coin.price.toLocaleString()}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Buy / Sell Tabs */}
          <View style={styles.sideSelector}>
            <TouchableOpacity
              onPress={() => setSide('BUY')}
              style={[styles.sideTab, side === 'BUY' && styles.buyActiveTab]}
            >
              <Text style={[styles.sideTabText, side === 'BUY' && styles.sideActiveText]}>AL (BUY)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSide('SELL')}
              style={[styles.sideTab, side === 'SELL' && styles.sellActiveTab]}
            >
              <Text style={[styles.sideTabText, side === 'SELL' && styles.sideActiveText]}>SAT (SELL)</Text>
            </TouchableOpacity>
          </View>

          {/* Balance info */}
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Kullanılabilir Sanal Bakiye:</Text>
            <Text style={styles.balanceValue}>${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
          </View>

          {/* Amount input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputPrefix}>$</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={amountStr}
              onChangeText={setAmountStr}
              placeholder="0.00"
              placeholderTextColor={Colors.textMuted}
            />
            <Text style={styles.inputSuffix}>USD</Text>
          </View>

          <Text style={styles.approxQty}>≈ {coinQuantity} {coin.symbol}</Text>

          {/* Presets */}
          <View style={styles.presetsRow}>
            {[100, 250, 500, 1000].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => handleSelectPreset(val)}
                style={[styles.presetBtn, amountStr === val.toString() && styles.presetBtnActive]}
              >
                <Text style={styles.presetText}>${val}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => handleSelectPreset(Math.floor(cashBalance * 0.25))}
              style={styles.presetBtn}
            >
              <Text style={styles.presetText}>%25</Text>
            </TouchableOpacity>
          </View>

          {/* AI Signal Recommendation note */}
          <View style={styles.aiHintBox}>
            <Ionicons name="sparkles" size={14} color={Colors.primary} />
            <Text style={styles.aiHintText}>
              Yapay Zeka Sinyali: <Text style={{ fontWeight: '700', color: Colors.primary }}>{coin.signal.action}</Text> (Güven: %{coin.signal.confidence})
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleExecute}
            activeOpacity={0.8}
            style={[styles.submitButton, { backgroundColor: side === 'BUY' ? Colors.bullish : Colors.bearish }]}
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
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.modalBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
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
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.cardBgElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBg,
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
  buyActiveTab: {
    backgroundColor: Colors.bullish,
  },
  sellActiveTab: {
    backgroundColor: Colors.bearish,
  },
  sideTabText: {
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 13,
  },
  sideActiveText: {
    color: '#FFFFFF',
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  balanceValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.bullish,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 6,
  },
  inputPrefix: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  approxQty: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    marginBottom: 14,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: Colors.cardBgElevated,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  presetBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryMuted,
  },
  presetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  aiHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 216, 246, 0.08)',
    padding: 10,
    borderRadius: 10,
    marginBottom: 18,
    gap: 8,
  },
  aiHintText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
