import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { TabParamList } from '@/navigation/types';
import MovieCard from '@/components/MovieCard';
import ModalSelect from '@/components/ModalSelect';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useUserStore } from '@/stores/useUserStore';
import { sortMovies, SortType, SortOrder } from '@/utils/sorting';
import { API_IMAGE_URL } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';

type Props = Partial<BottomTabScreenProps<TabParamList, 'WatchlistTab'>>;

const sortOptions = [
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Rating', value: 'rating' },
  { label: 'Release Date', value: 'release_date' },
];

const WatchlistScreen: React.FC<Props> = (props) => {
  const fallbackNavigation = useNavigation<any>();
  const navigation = props.navigation || fallbackNavigation;
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist);
  
  const { profile, fetchProfile } = useUserStore();
  const [sortBy, setSortBy] = useState<SortType>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const sortedWatchlist = sortMovies(watchlist, sortBy, sortOrder);

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const renderHeader = () => (
    <View>
      {/* ... Profile Section ... */}
      <View style={styles.profileSection}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButtonTop}
        >
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            {profile?.avatar?.tmdb?.avatar_path ? (
              <Image 
                source={{ uri: `${API_IMAGE_URL}${profile.avatar.tmdb.avatar_path}` }} 
                style={styles.avatarImage} 
              />
            ) : (
              <Text style={styles.avatarText}>
                {profile?.name?.charAt(0) || profile?.username?.charAt(0) || '?'}
              </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.name || profile?.username || 'User'}</Text>
            <Text style={styles.profileDate}>TMDB Member</Text>
          </View>
        </View>
      </View>

      {/* Filter & Sort Bar */}
      <View style={styles.filterBar}>
        <Text style={styles.watchlistTitle}>My Watchlist</Text>
        <View style={styles.controlsRow}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Filter by: </Text>
            <View style={styles.selectWrapper}>
              <ModalSelect
                options={sortOptions}
                selectedValue={sortBy}
                onSelect={(val) => setSortBy(val as SortType)}
                containerStyle={styles.compactSelect}
              />
            </View>
          </View>
          <View style={styles.sortGroup}>
            <Text style={styles.filterLabel}>Order: </Text>
            <TouchableOpacity onPress={toggleSortOrder} style={styles.orderButton}>
              <Ionicons 
                name={sortOrder === 'desc' ? "arrow-up" : "arrow-down"} 
                size={18} 
                color="#000" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedWatchlist}
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 50,
    height: 50,
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
    zIndex: 1000,
    elevation: 10, // Added for Android
    backgroundColor: '#FFFFFF', // Required for elevation shadow/rendering
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
    zIndex: 2000, // Higher than cards
    elevation: 20, // Higher than card elevation (2)
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectWrapper: {
    flex: 1,
    maxWidth: 150,
  },
  compactSelect: {
    marginBottom: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  sortGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderButton: {
    padding: 8,
    marginLeft: 4,
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