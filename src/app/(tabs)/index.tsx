import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';
import { Header } from '../../components/Header';
import { CoinCard } from '../../components/CoinCard';
import { usePortfolio } from '../../context/PortfolioContext';
import { useLanguage } from '../../context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'all' | 'ai' | 'gainers' | 'losers';

export default function MarketRadarScreen() {
  const { coins } = usePortfolio();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Stats for the market bar
  const strongBuyCount = coins.filter((c) => c.signal.action === 'GÜÇLÜ AL').length;
  const buyCount = coins.filter((c) => c.signal.action === 'AL').length;
  const sellCount = coins.filter((c) => c.signal.action === 'SAT' || c.signal.action === 'GÜÇLÜ SAT').length;

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) => {
      const matchesSearch =
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.name.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'ai') {
        return coin.signal.action === 'GÜÇLÜ AL' || coin.signal.action === 'AL';
      }
      if (activeFilter === 'gainers') {
        return coin.change24h > 0;
      }
      if (activeFilter === 'losers') {
        return coin.change24h < 0;
      }
      return true;
    });
  }, [coins, searchQuery, activeFilter]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />

      {/* Top AI Radar Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>İzlenen Varlık</Text>
          <Text style={styles.statVal}>20 Parite</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Güçlü Al Sinyali</Text>
          <Text style={[styles.statVal, { color: Colors.bullish }]}>{strongBuyCount} Adet</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Al Sinyali</Text>
          <Text style={[styles.statVal, { color: Colors.bullish }]}>{buyCount} Adet</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sat Sinyali</Text>
          <Text style={[styles.statVal, { color: Colors.bearish }]}>{sellCount} Adet</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('search_placeholder')}
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          onPress={() => setActiveFilter('all')}
          style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.filterTextActive]}>
            {t('filter_all')} ({coins.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter('ai')}
          style={[styles.filterChip, activeFilter === 'ai' && styles.filterChipActive]}
        >
          <Ionicons
            name="sparkles"
            size={12}
            color={activeFilter === 'ai' ? Colors.background : Colors.primary}
            style={{ marginRight: 4 }}
          />
          <Text style={[styles.filterText, activeFilter === 'ai' && styles.filterTextActive]}>
            {t('filter_ai_signals')} ({strongBuyCount + buyCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter('gainers')}
          style={[styles.filterChip, activeFilter === 'gainers' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, activeFilter === 'gainers' && styles.filterTextActive]}>
            {t('filter_gainers')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter('losers')}
          style={[styles.filterChip, activeFilter === 'losers' && styles.filterChipActive]}
        >
          <Text style={[styles.filterText, activeFilter === 'losers' && styles.filterTextActive]}>
            {t('filter_losers')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 20 Cryptos List */}
      <FlatList
        data={filteredCoins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CoinCard coin={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Aradığınız kriterlere uygun kripto varlık bulunamadı.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBgElevated,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  statVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
});
