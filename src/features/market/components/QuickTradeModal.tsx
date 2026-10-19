import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import { X } from 'lucide-react-native';
import { CoinMarketDto } from '../../../services/api/types';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { Button } from '../../../shared/components/Button';
import { useApp } from '../../../context/AppContext';

interface QuickTradeModalProps {
  visible: boolean;
  onClose: () => void;
  coin: CoinMarketDto;
  tradeType: 'BUY' | 'SELL';
}

export const QuickTradeModal: React.FC<QuickTradeModalProps> = ({
  visible,
  onClose,
  coin,
  tradeType,
}) => {
  const { portfolio, executeTrade } = useApp();
  const isBuy = tradeType === 'BUY';

  // Alım için kullanılabilir nakit (USDT), Satım için elde tutulan coin adedi
  const cashHolding = portfolio.holdings.find((h) => h.isCash);
  const availableUsdt = cashHolding ? cashHolding.valueUsd : 0;
  const currentHolding = portfolio.holdings.find((h) => h.symbol === coin.symbol);
  const availableCoinAmount = currentHolding ? currentHolding.amount : 0;

  const [amountInput, setAmountInput] = useState('100');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const numericAmount = parseFloat(amountInput) || 0;
  const estimatedCoins = isBuy
    ? (numericAmount / coin.priceUsd).toFixed(5)
    : numericAmount.toFixed(5);
  const totalCostUsd = isBuy
    ? numericAmount
    : (numericAmount * coin.priceUsd).toFixed(2);

  const handlePercentage = (pct: number) => {
    if (isBuy) {
      const val = (availableUsdt * pct).toFixed(2);
      setAmountInput(val);
    } else {
      const val = (availableCoinAmount * pct).toFixed(4);
      setAmountInput(val);
    }
  };

  const handleConfirm = async () => {
    if (numericAmount <= 0) return;
    setLoading(true);
    await executeTrade(
      coin.symbol,
      tradeType,
      isBuy ? parseFloat(estimatedCoins) : numericAmount,
      parseFloat(totalCostUsd.toString())
    );
    setLoading(false);
    setSuccessMessage(`${coin.symbol} ${isBuy ? 'alımı' : 'satışı'} başarıyla gerçekleşti!`);
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Başlık */}
          <View style={styles.header}>
            <Text style={[styles.title, isBuy ? styles.buyTitle : styles.sellTitle]}>
              {coin.name} ({coin.symbol}) {isBuy ? 'Satın Al' : 'Sat'}
            </Text>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Fiyat Bilgisi */}
          <Text style={styles.priceRow}>
            Birim Fiyat: ${coin.priceUsd.toLocaleString('tr-TR')}
          </Text>

          {/* Kullanılabilir Bakiye */}
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>
              {isBuy ? 'Kullanılabilir Nakit:' : `Kullanılabilir ${coin.symbol}:`}
            </Text>
            <Text style={styles.balanceVal}>
              {isBuy ? `$${availableUsdt.toFixed(2)} USDT` : `${availableCoinAmount} ${coin.symbol}`}
            </Text>
          </View>

          {/* Giriş Kutusu */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              value={amountInput}
              onChangeText={setAmountInput}
              keyboardType="numeric"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.currencyBadge}>{isBuy ? 'USD' : coin.symbol}</Text>
          </View>

          {/* Yüzde Butonları */}
          <View style={styles.pctRow}>
            {[0.25, 0.5, 0.75, 1].map((pct) => (
              <Pressable
                key={pct}
                style={styles.pctChip}
                onPress={() => handlePercentage(pct)}
              >
                <Text style={styles.pctText}>%{pct * 100}</Text>
              </Pressable>
            ))}
          </View>

          {/* Özet Satırı */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {isBuy ? 'Hesabınıza Geçecek:' : 'Toplam Tutar:'}
            </Text>
            <Text style={styles.summaryValue}>
              {isBuy ? `~${estimatedCoins} ${coin.symbol}` : `$${totalCostUsd} USDT`}
            </Text>
          </View>

          {successMessage ? (
            <Text style={styles.successText}>{successMessage}</Text>
          ) : null}

          {/* Onay Butonu */}
          <Button
            title={isBuy ? 'Alımı Onayla' : 'Satışı Onayla'}
            variant={isBuy ? 'success' : 'danger'}
            onPress={handleConfirm}
            loading={loading}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  sheet: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h3,
  },
  buyTitle: {
    color: colors.success,
  },
  sellTitle: {
    color: colors.danger,
  },
  closeBtn: {
    padding: 4,
  },
  priceRow: {
    ...typography.captionBold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  balanceLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  balanceVal: {
    ...typography.captionBold,
    color: colors.primary,
  },
  inputBox: {
    height: 52,
    backgroundColor: colors.inputBackground,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  input: {
    flex: 1,
    height: '100%',
    color: colors.textPrimary,
    ...typography.bodyBold,
    fontSize: 18,
  },
  currencyBadge: {
    ...typography.captionBold,
    color: colors.primary,
  },
  pctRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  pctChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    backgroundColor: '#0F1622',
    borderWidth: 1,
    borderColor: '#1D2A3D',
    alignItems: 'center',
  },
  pctText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#1A2434',
  },
  summaryLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  successText: {
    ...typography.captionBold,
    color: colors.success,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
