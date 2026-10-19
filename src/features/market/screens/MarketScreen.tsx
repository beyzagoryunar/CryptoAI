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
import { Search, Plus } from 'lucide-react-native';
import { colors, typography, spacing, borderRadius } from '../../../shared/theme';
import { useApp } from '../../../context/AppContext';
import { CoinRowItem } from '../components/CoinRowItem';
import { AddWatchlistModal } from '../components/AddWatchlistModal';
import { RootStackParamList } from '../../../navigation/navigation.types';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const MarketScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { coins } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'watchlist'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai' | 'popular'>('all');
  const [watchlistModalVisible, setWatchlistModalVisible] = useState(false);

  const filteredCoins = coins.filter((coin) => {
    if (activeTab === 'watchlist') {
      return coin.isWatchlisted;
    }
    if (activeFilter === 'ai') {
      return coin.aiSignal === 'GÜÇLÜ AL' || coin.aiSignal === 'AL';
    }
    if (activeFilter === 'popular') {
      return coin.symbol === 'BTC' || coin.symbol === 'ETH' || coin.symbol === 'SOL';
    }
    return true;
  });

  return (
    <View style={styles.screen}>
      {/* Başlık ve Arama */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Piyasa</Text>
        <Pressable
          style={styles.searchButton}
          onPress={() => setWatchlistModalVisible(true)}
        >
          <Search size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      {/* Segmentli Ana Sekme (Tüm Piyasa vs Takip Listem) */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tabButton, activeTab === 'all' && styles.tabButtonActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
            Tüm Piyasa
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tabButton, activeTab === 'watchlist' && styles.tabButtonActive]}
          onPress={() => setActiveTab('watchlist')}
        >
          <Text style={[styles.tabText, activeTab === 'watchlist' && styles.tabTextActive]}>
            ★ Takip Listem
          </Text>
        </Pressable>
      </View>

      {/* Alt Filtre Butonları (Yalnızca Tüm Piyasa aktifken) */}
      {activeTab === 'all' && (
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterChip, activeFilter === 'all' && styles.chipActive]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={[styles.chipText, activeFilter === 'all' && styles.chipTextActive]}>
              Tümü
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterChip, activeFilter === 'ai' && styles.chipActive]}
            onPress={() => setActiveFilter('ai')}
          >
            <Text style={[styles.chipText, activeFilter === 'ai' && styles.chipTextActive]}>
              🟢🤖 AI Sinyalleri
            </Text>
          </Pressable>

          <Pressable
            style={[styles.filterChip, activeFilter === 'popular' && styles.chipActive]}
            onPress={() => setActiveFilter('popular')}
          >
            <Text style={[styles.chipText, activeFilter === 'popular' && styles.chipTextActive]}>
              🔥 Popüler
            </Text>
          </Pressable>
        </View>
      )}

      {/* Tablo Sütun Başlıkları */}
      <View style={styles.tableHeaderRow}>
        <Text style={[styles.columnHeader, { flex: 2 }]}>
          {activeTab === 'watchlist' ? 'TAKİP EDİLEN VARLIK' : 'VARLIK'}
        </Text>
        <Text style={[styles.columnHeader, { flex: 1.5, textAlign: 'center' }]}>
          AI SİNYALİ
        </Text>
        <Text style={[styles.columnHeader, { flex: 2, textAlign: 'right' }]}>
          FİYAT
        </Text>
      </View>

      {/* Coin Listesi */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredCoins.map((coin) => (
          <CoinRowItem
            key={coin.symbol}
            coin={coin}
            onPress={() => navigation.navigate('CoinDetail', { symbol: coin.symbol })}
          />
        ))}

        {/* Takip Listesi Ekleme Butonu */}
        {activeTab === 'watchlist' && (
          <Pressable
            style={styles.addWatchlistButton}
            onPress={() => setWatchlistModalVisible(true)}
          >
            <Plus size={16} color={colors.textSecondary} />
            <Text style={styles.addWatchlistText}>
              Takip Listesine Yeni Coin Ekle
            </Text>
          </Pressable>
        )}
      </ScrollView>

      {/* Takip Listesi Modal */}
      <AddWatchlistModal
        visible={watchlistModalVisible}
        onClose={() => setWatchlistModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.full,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#10151E',
    borderRadius: borderRadius.md,
    padding: 4,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  tabButton: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: borderRadius.sm + 2,
  },
  tabButtonActive: {
    backgroundColor: colors.card,
  },
  tabText: {
    ...typography.bodyBold,
    color: colors.textMuted,
  },
  tabTextActive: {
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: '#0F1A28',
  },
  chipText: {
    ...typography.captionBold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.primary,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#141C28',
  },
  columnHeader: {
    ...typography.micro,
    color: colors.textMuted,
  },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
  },
  addWatchlistButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#243044',
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  addWatchlistText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
});
