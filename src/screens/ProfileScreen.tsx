import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useUserStore } from '@/stores/useUserStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { usePreferenceStore, MovieCategory } from '@/stores/usePreferenceStore';
import ModalSelect from '@/components/ModalSelect';
import { API_IMAGE_URL } from '@env';

const categoryOptions = [
  { label: 'Now Playing', value: 'now_playing' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Popular', value: 'popular' },
];

const DEFAULT_FAVORITES = [
  {
    id: 27205,
    title: 'Inception',
    poster_path: '/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    vote_average: 8.4,
  },
  {
    id: 157336,
    title: 'Interstellar',
    poster_path: '/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    vote_average: 8.4,
  },
  {
    id: 155,
    title: 'The Dark Knight',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    vote_average: 8.5,
  },
];

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, fetchProfile } = useUserStore();
  const watchlist = useWatchlistStore((state) => state.watchlist);
  const selectedCategory = usePreferenceStore((state) => state.selectedCategory);
  const setSelectedCategory = usePreferenceStore((state) => state.setSelectedCategory);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val as MovieCategory);
  };

  const handleNavigateToWatchlist = () => {
    try {
      navigation.navigate('watchlist');
    } catch {
      navigation.navigate('WatchlistTab');
    }
  };

  const handleMoviePress = (movieId: number) => {
    try {
      navigation.navigate('MovieDetail', { id: movieId });
    } catch {
      // Fallback
    }
  };

  const handleAboutTMDb = () => {
    Alert.alert(
      'About TMDb',
      'This product uses the TMDB API but is not endorsed or certified by TMDB.\n\nVersion: 1.0.0\nTheme: Cinematic Dark Glassmorphism',
      [{ text: 'Close', style: 'default' }]
    );
  };

  const handleAccountSettings = () => {
    Alert.alert(
      'Account Settings',
      `Username: @${profile?.username || 'user'}\nAccount ID: ${profile?.id || 'N/A'}\nStatus: TMDB Member`,
      [
        { text: 'Sync Account', onPress: onRefresh },
        { text: 'Done', style: 'cancel' },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to reset preferences and log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            setSelectedCategory('now_playing');
          },
        },
      ]
    );
  };

  const renderAvatar = () => {
    const avatarPath = profile?.avatar?.tmdb?.avatar_path;
    const initial = profile?.name?.charAt(0) || profile?.username?.charAt(0) || 'M';

    if (avatarPath) {
      return (
        <Image
          source={{ uri: `${API_IMAGE_URL}${avatarPath}` }}
          style={styles.avatarImage}
          resizeMode="cover"
        />
      );
    }

    return (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarInitial}>{initial.toUpperCase()}</Text>
      </View>
    );
  };

  const displayFavorites = watchlist.length > 0 ? watchlist.slice(0, 5) : DEFAULT_FAVORITES;

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
          <Ionicons name="film-outline" size={24} color="#64D3FF" />
        </TouchableOpacity>
        <Text style={styles.topHeaderTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={handleAccountSettings}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={22} color="#64D3FF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#64D3FF"
            colors={['#64D3FF']}
          />
        }
      >
        {/* Profile Header Section */}
        <View style={styles.heroSection}>
          <View style={styles.avatarContainer}>{renderAvatar()}</View>
          <Text style={styles.userName}>
            {profile?.name || profile?.username || 'MovieBuff99'}
          </Text>
          <Text style={styles.userSubtitle}>
            {profile?.username ? `@${profile.username} • ` : ''}Member since 2021
          </Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statItem}
              onPress={handleNavigateToWatchlist}
              activeOpacity={0.7}
            >
              <Text style={styles.statNumber}>{watchlist.length}</Text>
              <Text style={styles.statLabel}>MOVIES</Text>
            </TouchableOpacity>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{categoryOptions.length}</Text>
              <Text style={styles.statLabel}>LISTS</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {profile?.id ? String(profile.id).slice(-2) : '45'}
              </Text>
              <Text style={styles.statLabel}>REVIEWS</Text>
            </View>
          </View>
        </View>

        {/* Collections Section */}
        <View style={styles.collectionsSection}>
          {/* Favorite Movies Carousel */}
          <View style={styles.collectionBlock}>
            <View style={styles.collectionHeader}>
              <Text style={styles.collectionTitle}>Favorite Movies</Text>
              <TouchableOpacity onPress={handleNavigateToWatchlist}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carouselContainer}
            >
              {displayFavorites.map((movie) => {
                const posterUri = movie.poster_path
                  ? movie.poster_path.startsWith('http')
                    ? movie.poster_path
                    : `${API_IMAGE_URL}${movie.poster_path}`
                  : null;

                return (
                  <TouchableOpacity
                    key={movie.id}
                    style={styles.posterCard}
                    activeOpacity={0.8}
                    onPress={() => handleMoviePress(movie.id)}
                  >
                    {posterUri ? (
                      <Image source={{ uri: posterUri }} style={styles.posterImage} />
                    ) : (
                      <View style={styles.posterFallback}>
                        <Ionicons name="film" size={28} color="#64D3FF" />
                      </View>
                    )}
                    <View style={styles.posterGradientOverlay}>
                      <Text style={styles.posterTitle} numberOfLines={2}>
                        {movie.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Watchlist Carousel */}
          <View style={styles.collectionBlock}>
            <View style={styles.collectionHeader}>
              <Text style={styles.collectionTitle}>Watchlist</Text>
              <TouchableOpacity onPress={handleNavigateToWatchlist}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {watchlist.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.carouselContainer}
              >
                {watchlist.map((movie) => {
                  const posterUri = movie.poster_path
                    ? movie.poster_path.startsWith('http')
                      ? movie.poster_path
                      : `${API_IMAGE_URL}${movie.poster_path}`
                    : null;

                  return (
                    <TouchableOpacity
                      key={movie.id}
                      style={styles.posterCard}
                      activeOpacity={0.8}
                      onPress={() => handleMoviePress(movie.id)}
                    >
                      {posterUri ? (
                        <Image source={{ uri: posterUri }} style={styles.posterImage} />
                      ) : (
                        <View style={styles.posterFallback}>
                          <Ionicons name="film" size={28} color="#64D3FF" />
                        </View>
                      )}
                      <View style={styles.posterGradientOverlay}>
                        <Text style={styles.posterTitle} numberOfLines={2}>
                          {movie.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            ) : (
              <TouchableOpacity
                style={styles.emptyWatchlistCard}
                onPress={handleNavigateToWatchlist}
                activeOpacity={0.8}
              >
                <Ionicons name="bookmark-outline" size={26} color="#64D3FF" />
                <Text style={styles.emptyWatchlistText}>Your watchlist is currently empty</Text>
                <Text style={styles.emptyWatchlistSubtext}>Tap to explore movies</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeaderTitle}>Settings</Text>

          <View style={styles.settingsList}>
            {/* Account Settings */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleAccountSettings}
              activeOpacity={0.7}
            >
              <Ionicons name="person-circle-outline" size={22} color="#64D3FF" style={styles.settingIcon} />
              <Text style={styles.settingText}>Account Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#879299" />
            </TouchableOpacity>

            {/* App Preferences */}
            <View style={styles.settingsItemColumn}>
              <View style={styles.settingsRowHeader}>
                <Ionicons name="options-outline" size={22} color="#64D3FF" style={styles.settingIcon} />
                <Text style={styles.settingText}>Default Movie Category</Text>
              </View>
              <View style={styles.selectWrapper}>
                <ModalSelect
                  options={categoryOptions}
                  selectedValue={selectedCategory}
                  onSelect={handleCategoryChange}
                  placeholder="Select category"
                />
              </View>
            </View>

            {/* Notifications */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => Alert.alert('Notifications', 'Push notifications are enabled.')}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color="#64D3FF" style={styles.settingIcon} />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={18} color="#879299" />
            </TouchableOpacity>

            {/* About TMDb */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleAboutTMDb}
              activeOpacity={0.7}
            >
              <Ionicons name="information-circle-outline" size={22} color="#64D3FF" style={styles.settingIcon} />
              <Text style={styles.settingText}>About TMDb</Text>
              <Ionicons name="chevron-forward" size={18} color="#879299" />
            </TouchableOpacity>

            {/* Log Out */}
            <TouchableOpacity
              style={[styles.settingsItem, styles.logoutItem]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Ionicons name="log-out-outline" size={22} color="#FFB4AB" style={styles.settingIcon} />
              <Text style={styles.logoutText}>Log Out</Text>
              <Ionicons name="chevron-forward" size={18} color="#FFB4AB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* TMDB Badge Footer */}
        <View style={styles.footerSection}>
          <Text style={styles.footerDisclaimer}>
            This product uses the TMDB API but is not endorsed or certified by TMDB.
          </Text>
          <Text style={styles.versionLabel}>CineMirror • Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041424',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 14,
    backgroundColor: 'rgba(4, 20, 36, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  topHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64D3FF',
    letterSpacing: 0.5,
  },
  headerIconButton: {
    padding: 6,
    borderRadius: 20,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#64D3FF',
    backgroundColor: '#102131',
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: '#64D3FF',
    backgroundColor: '#102131',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#64D3FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInitial: {
    color: '#64D3FF',
    fontSize: 38,
    fontWeight: '700',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#D3E4FA',
    marginBottom: 4,
    textAlign: 'center',
  },
  userSubtitle: {
    fontSize: 14,
    color: '#BCC8CF',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#64D3FF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#BCC8CF',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  collectionsSection: {
    marginTop: 12,
    gap: 28,
  },
  collectionBlock: {
    width: '100%',
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  collectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D3E4FA',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64D3FF',
  },
  carouselContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  posterCard: {
    width: 120,
    height: 180,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#102131',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  posterFallback: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102131',
  },
  posterGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(4, 20, 36, 0.88)',
  },
  posterTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#D3E4FA',
    lineHeight: 15,
  },
  emptyWatchlistCard: {
    marginHorizontal: 16,
    backgroundColor: '#102131',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyWatchlistText: {
    color: '#D3E4FA',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  emptyWatchlistSubtext: {
    color: '#64D3FF',
    fontSize: 12,
    marginTop: 2,
  },
  settingsSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D3E4FA',
    marginBottom: 12,
  },
  settingsList: {
    gap: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#102131',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 16,
    minHeight: 54,
  },
  settingsItemColumn: {
    backgroundColor: '#102131',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
  },
  settingsRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectWrapper: {
    marginTop: 2,
  },
  settingIcon: {
    marginRight: 14,
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#D3E4FA',
  },
  logoutItem: {
    marginTop: 8,
    borderColor: 'rgba(255, 180, 171, 0.3)',
    backgroundColor: 'rgba(255, 180, 171, 0.05)',
  },
  logoutText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#FFB4AB',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  footerDisclaimer: {
    fontSize: 11,
    color: '#879299',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 6,
  },
  versionLabel: {
    fontSize: 11,
    color: '#64D3FF',
    opacity: 0.8,
  },
});

export default ProfileScreen;
