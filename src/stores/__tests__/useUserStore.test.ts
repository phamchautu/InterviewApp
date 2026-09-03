import { useUserStore } from '../useUserStore';
import { api } from '@/services/api';

jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

describe('useUserStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useUserStore.getState().clearProfile();
  });

  it('should have initial state with null profile', () => {
    const state = useUserStore.getState();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should successfully fetch and set profile data', async () => {
    const mockProfile = {
      id: 12345,
      name: 'Test User',
      username: 'testuser',
      avatar: {
        tmdb: {
          avatar_path: '/path/to/avatar.jpg',
        },
      },
    };

    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockProfile });

    await useUserStore.getState().fetchProfile();

    const state = useUserStore.getState();
    expect(state.profile).toEqual(mockProfile);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(api.get).toHaveBeenCalledWith('/3/account');
  });

  it('should handle API error when fetching profile', async () => {
    const errorMessage = 'Network error';
    (api.get as jest.Mock).mockRejectedValueOnce({
      response: { data: { status_message: errorMessage } },
    });

    await useUserStore.getState().fetchProfile();

    const state = useUserStore.getState();
    expect(state.profile).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('should clear profile data when clearProfile is called', () => {
    useUserStore.setState({
      profile: {
        id: 99,
        name: 'Existing',
        username: 'existing',
        avatar: { tmdb: { avatar_path: null } },
      },
    });

    expect(useUserStore.getState().profile).not.toBeNull();

    useUserStore.getState().clearProfile();

    expect(useUserStore.getState().profile).toBeNull();
  });
});
