import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '@/navigation/types';
import MovieCard from '@/components/MovieCard';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '@/theme/constants';

type Props = BottomTabScreenProps<TabParamList, 'WatchlistTab'>;

const WatchlistScreen: React.FC<Props> = ({ navigation }) => {
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist);

  const renderHeader = () => (
    <View>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButtonTop}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>J</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Lee</Text>
            <Text style={styles.profileDate}>Member since August 2023</Text>
          </View>
        </View>
      </View>

      {/* Filter & Sort Bar */}
      <View style={styles.filterBar}>
        <Text style={styles.watchlistTitle}>My Watchlist</Text>
        <View style={styles.controlsRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Filter by: </Text>
            <TouchableOpacity style={styles.filterValueContainer}>
              <Text style={styles.filterValue}>Rating</Text>
              <Ionicons name="chevron-down" size={14} color="#00B4E4" />
            </TouchableOpacity>
          </View>
          <View style={styles.sortGroup}>
            <Text style={styles.filterLabel}>Order: </Text>
            <TouchableOpacity>
              <Ionicons name="arrow-up" size={16} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={watchlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <MovieCard
              title={item.title}
              poster_path={item.poster_path}
              vote_average={item.vote_average}
              release_date={item.release_date}
              overview={item.overview}
              onRemove={() => removeFromWatchlist(item.id)}
              onPress={() => (navigation as any).navigate('MovieDetail', { id: item.id })}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Your watchlist is empty.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  profileSection: {
    backgroundColor: '#032541',
    padding: 20,
    paddingTop: 10, // Adjusted
  },
  backButtonTop: {
    marginBottom: 10,
    marginLeft: -10,
    padding: 10,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#9040F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  profileDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  filterBar: {
    padding: 20,
  },
  watchlistTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#666666',
  },
  filterValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#00B4E4',
  },
  filterValue: {
    fontSize: 14,
    color: '#00B4E4',
    fontWeight: '600',
    marginRight: 2,
  },
  listContent: {
    paddingBottom: 100,
  },
  cardWrapper: {
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    fontStyle: 'italic',
  },
});

export default WatchlistScreen;