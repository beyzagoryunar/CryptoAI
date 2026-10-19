import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Star, Search, Check } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { useApp } from '../../../context/AppContext';
import { useTheme } from '../../../context/ThemeContext';

interface AddWatchlistModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddWatchlistModal: React.FC<AddWatchlistModalProps> = ({
  visible,
  onClose,
}) => {
  const { coins, toggleWatchlist } = useApp();
  const { colors, isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  if (!visible) return null;

  const filtered = coins.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={[styles.sheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Başlık */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Takip Listesini Düzenle</Text>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <X size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Arama Girişi */}
        <View style={[styles.searchBox, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}>
          <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Coin ara (BTC, SOL...)"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={6}>
              <X size={14} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>

        {/* Coin Listesi */}
        <ScrollView style={styles.coinList} showsVerticalScrollIndicator={false}>
          {filtered.map((coin) => (
            <View key={coin.symbol} style={[styles.coinRow, { borderBottomColor: colors.border }]}>
              <View style={styles.leftCol}>
                <View style={[styles.coinIcon, { backgroundColor: coin.color }]}>
                  <Text style={styles.iconLetter}>{coin.iconLetter}</Text>
                </View>
                <View>
                  <Text style={[styles.symbol, { color: colors.textPrimary }]}>{coin.symbol}</Text>
                  <Text style={[styles.name, { color: colors.textSecondary }]}>{coin.name}</Text>
                </View>
              </View>

              <View style={styles.rightCol}>
                <Text style={[styles.price, { color: colors.textPrimary }]}>
                  ${coin.priceUsd.toLocaleString('tr-TR')}
                </Text>
                <Pressable
                  style={[
                    styles.starBtn,
                    coin.isWatchlisted && styles.starBtnActive,
                    { backgroundColor: coin.isWatchlisted ? 'rgba(255, 214, 0, 0.15)' : colors.inputBackground },
                  ]}
                  onPress={() => toggleWatchlist(coin.symbol)}
                  hitSlop={8}
                >
                  <Star
                    size={18}
                    color={coin.isWatchlisted ? colors.warning : colors.textMuted}
                    fill={coin.isWatchlisted ? colors.warning : 'transparent'}
                  />
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
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
    maxWidth: 420,
    maxHeight: 520,
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  closeBtn: {
    padding: 4,
  },
  searchBox: {
    height: 44,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    ...typography.bodyMedium,
  },
  coinList: {
    maxHeight: 340,
  },
  coinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: '#161F2E',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinIcon: {
    width: 34,
    height: 34,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconLetter: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  symbol: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  name: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  price: {
    ...typography.captionBold,
    color: colors.textPrimary,
  },
  starBtn: {
    padding: 8,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starBtnActive: {
    transform: [{ scale: 1.05 }],
  },
});
