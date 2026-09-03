import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, ActivityIndicator, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useLocalSearchParams } from 'expo-router';
import { RootStackParamList } from '@/navigation/types';
import { useMovieDetailStore } from '@/stores/useMovieDetailStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { API_IMAGE_URL } from '@env';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '@/theme/constants';
import ScoreCircle from '@/components/ScoreCircle';

type Props = Partial<NativeStackScreenProps<RootStackParamList, 'MovieDetail'>>;

const { width } = Dimensions.get('window');
const HERO_BLUE = '#00B4E4';

const MovieDetailScreen: React.FC<Props> = (props) => {
  const fallbackNavigation = useNavigation<any>();
  const navigation = props.navigation || fallbackNavigation;
  const localParams = useLocalSearchParams<{ id: string }>();
  const rawId = props.route?.params?.id ?? localParams?.id;
  const id = typeof rawId === 'string' ? parseInt(rawId, 10) : (rawId || 0);
  const { movie, recommendations, isLoading, fetchMovieDetail, clearMovieDetail } = useMovieDetailStore();
  
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const addToWatchlist = useWatchlistStore((state) => state.addToWatchlist);
  const removeFromWatchlist = useWatchlistStore((state) => state.removeFromWatchlist);
  
  const isInWatchlist = watchlist.some((m) => m.id === id);

  useEffect(() => {
    fetchMovieDetail(id);
    return () => clearMovieDetail();
  }, [id]);

  React.useLayoutEffect(() => {
    if (movie) {
      const year = movie.release_date?.split('-')[0] || '';
      navigation.setOptions({
        headerTitle: `${movie.title} (${year})`,
        headerStyle: { backgroundColor: '#38a4fc' },
        headerTintColor: '#FFFFFF',
      });
    }
  }, [navigation, movie]);

  if (isLoading || !movie) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={HERO_BLUE} />
      </View>
    );
  }

  const handleWatchlistPress = () => {
    if (isInWatchlist) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist(movie);
    }
  };

  const getCertification = () => {
    const usRelease = movie.release_dates?.results?.find(r => r.iso_3166_1 === 'US');
    return usRelease?.release_dates[0]?.certification || 'NR';
  };

  const getDirectorsAndWriters = () => {
    const crew = movie.credits?.crew || [];
    return crew.filter(c => c.job === 'Director' || c.department === 'Writing')
      .slice(0, 4); // Limit to 4 for space
  };

  const directorsAndWriters = getDirectorsAndWriters();

  const renderCastItem = ({ item }: { item: any }) => (
    <View style={styles.castCard}>
      <Image 
        source={{ uri: item.profile_path ? `${API_IMAGE_URL}${item.profile_path}` : 'https://via.placeholder.com/150' }}
        style={styles.castImage}
      />
      <View style={styles.castInfo}>
        <Text style={styles.castName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.castCharacter} numberOfLines={1}>{item.character}</Text>
      </View>
    </View>
  );

  const renderRecommendation = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.recCard}
      onPress={() => navigation.push('MovieDetail', { id: item.id })}
    >
      <Image 
        source={{ uri: `${API_IMAGE_URL}${item.backdrop_path || item.poster_path}` }}
        style={styles.recImage}
      />
      <View style={styles.recInfo}>
        <Text style={styles.recTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.recScore}>{Math.round(item.vote_average * 10)}%</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroTopRow}>
          <Image 
            source={{ uri: `${API_IMAGE_URL}${movie.poster_path}` }}
            style={styles.mainPoster} 
          />
          <View style={styles.heroMetadata}>
            <View style={styles.certBox}>
              <Text style={styles.certText}>{getCertification()}</Text>
            </View>
            <Text style={styles.heroText}>{movie.release_date} (US)</Text>
            <Text style={styles.heroText}>{movie.runtime}m</Text>
            <Text style={styles.heroText}>
              {movie.genres?.map(g => g.name).join(', ')}
            </Text>
            <Text style={styles.metadataText}>Status: <Text style={styles.heroText}>{movie.status}</Text> </Text>
            <Text style={styles.metadataText}>Language: <Text style={styles.heroText}>{movie.original_language?.toUpperCase()}</Text></Text>
          </View>
        </View>

        <View style={styles.heroMiddleRow}>
          <View style={styles.scoreBlock}>
            <ScoreCircle score={movie.vote_average} size={60} />
            <Text style={styles.scoreLabel}>User Score</Text>
          </View>
          <View style={styles.crewBlock}>
            {directorsAndWriters.map((person, index) => (
              <View key={`${person.id}-${index}`} style={styles.crewItem}>
                <Text style={styles.crewName}>{person.name}</Text>
                <Text style={styles.crewRole}>{person.job}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.heroInfoBlock}>
          {movie.tagline ? <Text style={styles.tagline}>&quot;{movie.tagline}&quot;</Text> : null}
          <Text style={styles.overviewTitle}>Overview</Text>
          <Text style={styles.overviewText}>{movie.overview}</Text>
        </View>

        <TouchableOpacity 
          style={[styles.watchlistButton, isInWatchlist && styles.watchlistButtonActive]} 
          onPress={handleWatchlistPress}
        >
          <Ionicons name={isInWatchlist ? "checkmark-circle" : "bookmark"} size={20} color="#FFFFFF" />
          <Text style={styles.watchlistText}>
            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cast Section */}
      <View style={styles.whiteSection}>
        <Text style={styles.sectionTitle}>Top Billed Cast</Text>
        <FlatList
          horizontal
          nestedScrollEnabled
          data={movie.credits?.cast?.slice(0, 10)}
          renderItem={renderCastItem}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ListEmptyComponent={<Text style={styles.emptyText}>No cast information available.</Text>}
        />
      </View>

      {/* Recommendations Section */}
      <View style={styles.whiteSection}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <FlatList
          horizontal
          nestedScrollEnabled
          data={recommendations}
          renderItem={renderRecommendation}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ListEmptyComponent={<Text style={styles.emptyText}>No recommendations found.</Text>}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HERO_BLUE, // Match top section color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: HERO_BLUE,
  },
  heroSection: {
    backgroundColor: HERO_BLUE,
    paddingBottom: 20,
    paddingTop: 0, // Removed top padding
  },
  heroTopRow: {
    flexDirection: 'row',
    backgroundColor:'#38a4fc',
    padding:20
  },
  mainPoster: {
    width: 100,
    height: 160,
    borderRadius: 8,
  },
  heroMetadata: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  certBox: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  certText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroText: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '400',
  },
  metadataText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  heroMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:20
  },
  scoreBlock: {
    flex:1
  },
  scoreLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  crewBlock: {
    flex: 1,
  },
  crewItem: {
    marginBottom: 8,
  },
  crewName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  crewRole: {
    color: '#FFFFFF',
    fontSize: 12,
    opacity: 0.8,
  },
  heroInfoBlock: {
    padding: 20,
  },
  tagline: {
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 16,
  },
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  overviewText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4, // Updated from 24 to 4
    paddingVertical: 12,
    marginTop: 10,
    marginHorizontal:20
  },
  watchlistButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'transparent',
  },
  watchlistText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  whiteSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 20,
    marginBottom: 16,
  },
  horizontalList: {
    paddingLeft: 20,
  },
  emptyText: {
    color: '#666666',
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 10,
    marginLeft: 20,
  },
  castCard: {
    width: 120,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  castImage: {
    width: 120,
    height: 150,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  castInfo: {
    padding: 8,
  },
  castName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  castCharacter: {
    fontSize: 12,
    color: '#666666',
  },
  recCard: {
    width: 200,
    marginRight: 12,
  },
  recImage: {
    width: 200,
    height: 112,
    borderRadius: 8,
    marginBottom: 8,
  },
  recInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recTitle: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  recScore: {
    fontSize: 12,
    color: '#666666',
  },
});

export default MovieDetailScreen;
