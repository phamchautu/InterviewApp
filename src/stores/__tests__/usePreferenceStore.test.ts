import { usePreferenceStore } from '../usePreferenceStore';

describe('usePreferenceStore', () => {
  beforeEach(() => {
    usePreferenceStore.setState({
      selectedCategory: 'now_playing',
      sortBy: null,
      _hasHydrated: true,
    });
  });

  it('should have correct default state', () => {
    const state = usePreferenceStore.getState();
    expect(state.selectedCategory).toBe('now_playing');
    expect(state.sortBy).toBeNull();
  });

  it('should update selectedCategory when setSelectedCategory is called', () => {
    usePreferenceStore.getState().setSelectedCategory('popular');
    expect(usePreferenceStore.getState().selectedCategory).toBe('popular');

    usePreferenceStore.getState().setSelectedCategory('upcoming');
    expect(usePreferenceStore.getState().selectedCategory).toBe('upcoming');
  });

  it('should update sortBy when setSortBy is called', () => {
    usePreferenceStore.getState().setSortBy('rating');
    expect(usePreferenceStore.getState().sortBy).toBe('rating');

    usePreferenceStore.getState().setSortBy(null);
    expect(usePreferenceStore.getState().sortBy).toBeNull();
  });
});
