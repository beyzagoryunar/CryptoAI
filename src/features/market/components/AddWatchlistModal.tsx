import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Star, Search } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { useApp } from '../../../context/AppContext';

interface AddWatchlistModalProps {
  visible: boolean;
  onClose: () => void;
}

export const AddWatchlistModal: React.FC<AddWatchlistModalProps> = ({
  visible,
  onClose,
}) => {
  const { coins, toggleWatchlist } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = coins.filter(
    (c) =>
      c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Başlık */}
          <View style={styles.header}>
            <Text style={styles.title}>Takip Listesini Düzenle</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <X size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Arama Girişi */}
          <View style={styles.searchBox}>
            <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Coin ara (BTC, SOL...)"
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Coin Listesi */}
          <ScrollView style={styles.coinList} showsVerticalScrollIndicator={false}>
            {filtered.map((coin) => (
              <View key={coin.symbol} style={styles.coinRow}>
                <View style={styles.leftCol}>
                  <View style={[styles.coinIcon, { backgroundColor: coin.color }]}>
                    <Text style={styles.iconLetter}>{coin.iconLetter}</Text>
                  </View>
                  <View>
                    <Text style={styles.symbol}>{coin.symbol}</Text>
                    <Text style={styles.name}>{coin.name}</Text>
                  </View>
                </View>

                <View style={styles.rightCol}>
                  <Text style={styles.price}>${coin.priceUsd.toLocaleString('tr-TR')}</Text>
                  <Pressable
                    style={[
                      styles.starBtn,
                      coin.isWatchlisted && styles.starBtnActive,
                    ]}
                    onPress={() => toggleWatchlist(coin.symbol)}
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
    maxHeight: 520,
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
    padding: 6,
  },
  starBtnActive: {
    transform: [{ scale: 1.1 }],
  },
});
