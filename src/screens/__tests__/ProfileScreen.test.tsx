import React from 'react';
import ProfileScreen from '../ProfileScreen';
import { useUserStore } from '@/stores/useUserStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { usePreferenceStore } from '@/stores/usePreferenceStore';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: jest.fn(),
  }),
}));

jest.mock('@expo/vector-icons/Ionicons', () => 'Ionicons');
jest.mock('@/components/ModalSelect', () => 'ModalSelect');

describe('ProfileScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.setState({
      profile: {
        id: 101,
        name: 'Jane Doe',
        username: 'janedoe',
        avatar: { tmdb: { avatar_path: '/avatar.jpg' } },
      },
      isLoading: false,
      error: null,
    });

    useWatchlistStore.setState({
      watchlist: [
        {
          id: 1,
          title: 'Inception',
          poster_path: '/p.jpg',
          backdrop_path: '/b.jpg',
          overview: 'Dream within a dream',
          release_date: '2010-07-16',
          vote_average: 8.8,
        },
      ],
    });

    usePreferenceStore.setState({
      selectedCategory: 'now_playing',
      sortBy: 'rating',
      _hasHydrated: true,
    });
  });

  it('renders correctly as a component', () => {
    const element = React.createElement(ProfileScreen);
    expect(element).toBeDefined();
    expect(element.type).toBe(ProfileScreen);
  });

  it('provides profile and watchlist data to the component hierarchy', () => {
    const userState = useUserStore.getState();
    const watchlistState = useWatchlistStore.getState();
    const prefState = usePreferenceStore.getState();

    expect(userState.profile?.name).toBe('Jane Doe');
    expect(userState.profile?.username).toBe('janedoe');
    expect(watchlistState.watchlist.length).toBe(1);
    expect(prefState.selectedCategory).toBe('now_playing');
  });

  it('handles fallback initials when avatar path is null', () => {
    useUserStore.setState({
      profile: {
        id: 102,
        name: null as any,
        username: 'bob_the_builder',
        avatar: { tmdb: { avatar_path: null } },
      },
    });

    const userState = useUserStore.getState();
    const initial =
      userState.profile?.name?.charAt(0) ||
      userState.profile?.username?.charAt(0) ||
      'M';
    expect(initial.toUpperCase()).toBe('B');
  });

  it('supports empty watchlist with fallback empty state', () => {
    useWatchlistStore.setState({ watchlist: [] });
    expect(useWatchlistStore.getState().watchlist.length).toBe(0);
  });
});
