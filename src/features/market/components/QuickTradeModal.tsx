import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { X, CheckCircle, ArrowDownUp, AlertCircle } from 'lucide-react-native';
import { CoinMarketDto } from '../../../services/api/types';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { useApp } from '../../../context/AppContext';
import { useTheme } from '../../../context/ThemeContext';

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
  tradeType: initialTradeType,
}) => {
  const { portfolio, executeTrade } = useApp();
  const { colors, isDark } = useTheme();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>(initialTradeType);
  const [amountInput, setAmountInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const isBuy = tradeType === 'BUY';

  // Alım için kullanılabilir nakit (USDT)
  const cashHolding = portfolio.holdings.find((h) => h.isCash);
  const availableUsdt = cashHolding ? cashHolding.valueUsd : 0;

  // Satım için elde tutulan coin adedi
  const currentHolding = portfolio.holdings.find((h) => h.symbol === coin.symbol);
  const availableCoinAmount = currentHolding ? currentHolding.amount : 0;

  // Modal her açıldığında ve tradeType değiştiğinde makul bir başlangıç tutarı ata
  useEffect(() => {
    setTradeType(initialTradeType);
    if (initialTradeType === 'BUY') {
      setAmountInput('500');
    } else {
      const defaultSell = availableCoinAmount > 0 ? (availableCoinAmount * 0.25).toFixed(4) : '0';
      setAmountInput(defaultSell);
    }
  }, [initialTradeType, visible, availableCoinAmount]);

  const handleSwitchType = (type: 'BUY' | 'SELL') => {
    setTradeType(type);
    if (type === 'BUY') {
      setAmountInput('500');
    } else {
      const defaultSell = availableCoinAmount > 0 ? (availableCoinAmount * 0.25).toFixed(4) : '0';
      setAmountInput(defaultSell);
    }
  };

  if (!visible) return null;

  const numericInput = parseFloat(amountInput) || 0;

  // Alım yaparken girilen tutar USDT, satım yaparken girilen tutar COIN adedi
  const estimatedCoins = isBuy
    ? (numericInput / coin.priceUsd).toFixed(5)
    : numericInput.toFixed(5);

  const totalCostUsd = isBuy
    ? numericInput
    : numericInput * coin.priceUsd;

  const isInsufficient = isBuy
    ? numericInput > availableUsdt
    : numericInput > availableCoinAmount;

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
    if (numericInput <= 0 || isInsufficient) return;
    setLoading(true);
    await executeTrade(
      coin.symbol,
      tradeType,
      isBuy ? parseFloat(estimatedCoins) : numericInput,
      totalCostUsd
    );
    setLoading(false);
    setSuccessMessage(
      isBuy
        ? `Tebrikler! ${estimatedCoins} ${coin.symbol} başarıyla alındı.`
        : `Tebrikler! ${numericInput} ${coin.symbol} satıldı, $${totalCostUsd.toFixed(2)} nakit eklendi.`
    );
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 1600);
  };

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Üst Sekmeli İşlem Türü Değiştirici */}
        <View style={styles.typeSwitcherRow}>
          <Pressable
            style={[
              styles.typeTab,
              isBuy && { backgroundColor: colors.success, borderColor: colors.success },
            ]}
            onPress={() => handleSwitchType('BUY')}
          >
            <Text style={[styles.typeTabText, isBuy ? styles.activeBuyText : { color: colors.textSecondary }]}>
              AL (Satın Al)
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.typeTab,
              !isBuy && { backgroundColor: colors.danger, borderColor: colors.danger },
            ]}
            onPress={() => handleSwitchType('SELL')}
          >
            <Text style={[styles.typeTabText, !isBuy ? styles.activeSellText : { color: colors.textSecondary }]}>
              SAT (Satış Yap)
            </Text>
          </Pressable>

          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Varlık & Canlı Fiyat Bilgisi */}
        <View style={styles.coinHeaderRow}>
          <View>
            <Text style={[styles.coinName, { color: colors.textPrimary }]}>
              {coin.name} ({coin.symbol})
            </Text>
            <Text style={[styles.coinPrice, { color: colors.primary }]}>
              1 {coin.symbol} = ${coin.priceUsd.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Kullanılabilir Bakiye Bilgisi */}
        <View style={[styles.balanceCard, { backgroundColor: isDark ? '#0C121C' : '#F1F5F9', borderColor: colors.border }]}>
          <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>
            {isBuy ? 'Kullanılabilir Nakit (USDT):' : `Kullanılabilir ${coin.symbol}:`}
          </Text>
          <Text style={[styles.balanceValue, { color: colors.textPrimary }]}>
            {isBuy
              ? `$${availableUsdt.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} USDT`
              : `${availableCoinAmount} ${coin.symbol}`}
          </Text>
        </View>

        {/* Miktar Giriş Kutusu */}
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          {isBuy ? 'Yatırılacak Tutar (USDT)' : `Satılacak Miktar (${coin.symbol})`}
        </Text>
        <View
          style={[
            styles.inputBox,
            { backgroundColor: colors.inputBackground, borderColor: isInsufficient ? colors.danger : colors.inputBorder },
          ]}
        >
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            value={amountInput}
            onChangeText={setAmountInput}
            keyboardType="decimal-pad"
            placeholder="0.00"
            placeholderTextColor={colors.textMuted}
          />
          <Text style={[styles.currencyBadge, { color: isBuy ? colors.success : colors.danger }]}>
            {isBuy ? 'USDT' : coin.symbol}
          </Text>
        </View>

        {/* Yetersiz Bakiye Uyarısı */}
        {isInsufficient ? (
          <View style={styles.warningRow}>
            <AlertCircle size={14} color={colors.danger} />
            <Text style={[styles.warningText, { color: colors.danger }]}>
              Yetersiz Bakiye! En fazla {isBuy ? `$${availableUsdt.toFixed(2)}` : `${availableCoinAmount} ${coin.symbol}`} girebilirsiniz.
            </Text>
          </View>
        ) : null}

        {/* Hızlı Yüzde Butonları (%25, %50, %75, %100) */}
        <View style={styles.pctRow}>
          {[0.25, 0.5, 0.75, 1].map((pct) => (
            <Pressable
              key={pct}
              style={[
                styles.pctChip,
                { backgroundColor: isDark ? '#0F1622' : '#F1F5F9', borderColor: colors.border },
              ]}
              onPress={() => handlePercentage(pct)}
            >
              <Text style={[styles.pctText, { color: colors.textSecondary }]}>
                {pct === 1 ? 'MAX' : `%${pct * 100}`}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* İşlem Özeti */}
        <View style={[styles.summaryBox, { borderColor: colors.border }]}>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Komisyon Oranı:</Text>
            <Text style={[styles.summaryVal, { color: colors.success }]}>%0.08 (Sıfıra Yakın)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
              {isBuy ? 'Alınacak Tahmini Miktar:' : 'Hesaba Geçecek Tutar:'}
            </Text>
            <Text style={[styles.summaryValBold, { color: isBuy ? colors.success : colors.textPrimary }]}>
              {isBuy
                ? `~${estimatedCoins} ${coin.symbol}`
                : `$${totalCostUsd.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} USDT`}
            </Text>
          </View>
        </View>

        {/* Başarı Mesajı */}
        {successMessage ? (
          <View style={styles.successBox}>
            <CheckCircle size={16} color={colors.success} />
            <Text style={[styles.successText, { color: colors.success }]}>{successMessage}</Text>
          </View>
        ) : null}

        {/* Onay Butonu */}
        <Pressable
          style={[
            styles.actionButton,
            { backgroundColor: isBuy ? colors.success : colors.danger },
            (loading || isInsufficient || numericInput <= 0) && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={loading || isInsufficient || numericInput <= 0}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={[styles.actionButtonText, { color: isBuy ? '#052914' : '#FFFFFF' }]}>
              {isBuy
                ? `${coin.symbol} Satın Al (AL)`
                : `${coin.symbol} Satışını Onayla (SAT)`}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 99999,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  sheet: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: colors.card,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 25,
  },
  typeSwitcherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeTab: {
    flex: 1,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeTabText: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  activeBuyText: {
    color: '#062816',
    fontWeight: '800',
  },
  activeSellText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  closeBtn: {
    padding: 8,
    marginLeft: spacing.xs,
  },
  coinHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  coinName: {
    ...typography.h3,
    fontSize: 18,
  },
  coinPrice: {
    ...typography.captionBold,
    marginTop: 2,
  },
  balanceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  balanceLabel: {
    ...typography.caption,
  },
  balanceValue: {
    ...typography.bodyBold,
  },
  inputLabel: {
    ...typography.captionBold,
    marginBottom: 6,
  },
  inputBox: {
    height: 52,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    flex: 1,
    height: '100%',
    ...typography.bodyBold,
    fontSize: 18,
  },
  currencyBadge: {
    ...typography.captionBold,
    fontSize: 13,
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.xs,
    marginTop: 4,
  },
  warningText: {
    ...typography.micro,
  },
  pctRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  pctChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    alignItems: 'center',
  },
  pctText: {
    ...typography.captionBold,
  },
  summaryBox: {
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginBottom: spacing.md,
    gap: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    ...typography.caption,
  },
  summaryVal: {
    ...typography.captionBold,
  },
  summaryValBold: {
    ...typography.bodyBold,
    fontSize: 14,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(0, 230, 118, 0.12)',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  successText: {
    ...typography.captionBold,
    flex: 1,
  },
  actionButton: {
    height: 52,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.45,
  },
  actionButtonText: {
    ...typography.bodyBold,
    fontSize: 16,
    fontWeight: '800',
  },
});
