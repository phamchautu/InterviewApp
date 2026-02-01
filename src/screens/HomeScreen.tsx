import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Text, RefreshControl } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { TabParamList, RootStackParamList } from '@/navigation/types';
import MovieCard from '@/components/MovieCard';
import Select from '@/components/Select';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { useMovieStore } from '@/stores/useMovieStore';
import { usePreferenceStore, MovieCategory, SortOption } from '@/stores/usePreferenceStore';
import { Movie } from '@/types';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'HomeTab'>,
  NativeStackScreenProps<RootStackParamList>
>;

const categoryOptions = [
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Popular', value: 'popular' },
];

const sortOptions = [
  { label: 'Alphabetical', value: 'alphabetical' },
  { label: 'Rating', value: 'rating' },
  { label: 'Release Date', value: 'release_date' },
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const {
    movies,
    isLoading,
    fetchMovies,
    fetchNextPage,
    clearMovies,
    page,
    totalPages
  } = useMovieStore();

  const [searchQuery, setSearchQuery] = useState('');
  const selectedCategory = usePreferenceStore((state) => state.selectedCategory);
  const setSelectedCategory = usePreferenceStore((state) => state.setSelectedCategory);
  const sortBy = usePreferenceStore((state) => state.sortBy);
  const setSortBy = usePreferenceStore((state) => state.setSortBy);
  const hasHydrated = usePreferenceStore((state) => state._hasHydrated);

  // Initial fetch on mount once store is hydrated
  useEffect(() => {
    if (hasHydrated) {
      handleSearchPress();
    }
  }, [hasHydrated]); 

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value as MovieCategory);
  };

  const handleSortSelect = (value: string) => {
    setSortBy(value as SortOption);
  };

  const handleInputChange = (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      clearMovies();
    }
  };

  const handleSearchPress = () => {
    fetchMovies({
      category: selectedCategory,
      sortBy: sortBy,
      searchQuery: searchQuery,
      page: 1, // Reset to page 1 on new search
    });
  };

  const handleRefresh = () => {
    fetchMovies({
      category: selectedCategory,
      sortBy: sortBy,
      searchQuery: searchQuery,
      page: 1,
    });
  };

  const handleLoadMore = () => {
    fetchNextPage({
      category: selectedCategory,
      sortBy: sortBy,
      searchQuery: searchQuery,
    });
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard 
      title={item.title} 
      poster_path={item.poster_path}
      vote_average={item.vote_average}
      release_date={item.release_date}
      overview={item.overview}
      onPress={() => navigation.navigate('MovieDetail', { id: item.id })}
    />
  );
  const renderFooter = () => {
    if (isLoading && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#00A3FF" />
        </View>
      );
    }
    // Only show if there are more pages to load
    if (page < totalPages && !isLoading && movies.length > 0) {
      return (
        <View style={styles.footerButtonContainer}>
          <Button 
            title="Load More" 
            onPress={handleLoadMore} 
            isActive={true} 
            style={styles.loadMoreButton}
          />
        </View>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <View style={styles.column}>
          <Select 
            options={categoryOptions}
            selectedValue={selectedCategory}
            onSelect={handleCategorySelect}
            containerStyle={styles.control}
          />
        </View>
        <View style={styles.column}>
          <Select 
            options={sortOptions}
            selectedValue={sortBy}
            onSelect={handleSortSelect}
            onClear={() => setSortBy(null)}
            placeholder="Sort By"
            containerStyle={styles.control}
          />
        </View>
        <View style={styles.column}>
          <Input 
            placeholder="Search..." 
            onSearch={() => {}} 
            value={searchQuery}
            onChangeText={handleInputChange}
            containerStyle={styles.control}
          />
          <Button 
            title="Search" 
            onPress={handleSearchPress} 
            isActive={true} 
            style={styles.searchButton}
          />
        </View>
      </View>

      {isLoading && movies.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00A3FF" />
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovie}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isLoading && movies.length > 0 && page === 1} onRefresh={handleRefresh} tintColor="#00A3FF" />
          }
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            !isLoading ? <Text style={styles.emptyText}>No movies found.</Text> : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  controlsContainer: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 10,
  },
  column: {
    width: '100%',
    marginBottom: 12,
  },
  control: {
    marginBottom: 0,
    marginHorizontal: 0,
  },
  searchButton: {
    marginTop: 8,
    height: 48,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerButtonContainer: {
    paddingVertical: 20,
  },
  loadMoreButton: {
    borderRadius: 4,
  },
});

export default HomeScreen;