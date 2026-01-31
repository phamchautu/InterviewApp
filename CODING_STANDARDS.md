# Engineering Standards: React Native, TypeScript, Zustand, React Navigation

## Role Definition
**Senior React Native Engineer**
*   **Focus:** Scalability, performance, type safety, and maintainability.
*   **Mindset:** "Write code that is easy to delete/refactor, not just easy to write."
*   **Architecture:** Separation of concerns (UI vs. Business Logic vs. State Management).

## Coding Rules & Conventions

### 1. TypeScript
*   **Strict Mode:** Always enabled. No implicit `any`.
*   **Types vs Interfaces:** Use `interface` for object definitions (props, state) and `type` for unions/intersections.
*   **Props:** Always define a `Props` interface for components, even if empty.
    ```typescript
    interface Props {
      title: string;
      onPress: () => void;
    }
    ```
*   **Generics:** Use generics for reusable components and hooks to maintain type safety.

### 2. React Native (UI/UX)
*   **Functional Components:** Use functional components with Hooks exclusively.
*   **Styling:**
    *   Use `StyleSheet.create` always. Avoid inline styles (performance & readability).
    *   Group styles logically (container, text, image).
*   **Performance:**
    *   Use `React.memo` for components that re-render often but props rarely change.
    *   Use `useCallback` for functions passed as props to memoized components.
    *   Use `useMemo` for expensive calculations.
*   **Structure:**
    *   `src/components`: Reusable UI components (buttons, cards).
    *   `src/screens`: Full-page views connected to navigation.
    *   `src/hooks`: Custom hooks for logic reuse.

### 3. State Management (Zustand)
*   **Atomic Stores:** Split stores by domain (e.g., `useAuthStore`, `useCartStore`) rather than one giant store.
*   **Selectors:** Always use selectors when consuming state to prevent unnecessary re-renders.
    ```typescript
    // BAD
    const { user, token } = useAuthStore();
    
    // GOOD
    const user = useAuthStore((state) => state.user);
    const token = useAuthStore((state) => state.token);
    ```
*   **Actions:** Define actions inside the store. Keep components free of complex state logic.
*   **Persistence:** Use `persist` middleware with `@react-native-async-storage/async-storage` for state that needs to survive app restarts (e.g., auth tokens, user preferences).
    ```typescript
    import { persist, createJSONStorage } from 'zustand/middleware';
    import AsyncStorage from '@react-native-async-storage/async-storage';
    
    // ... create store
    persist(
      (set, get) => ({ ... }),
      {
        name: 'storage-key',
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
    ```

### 4. Navigation (React Navigation)
*   **Type Safety:** strictly type all navigators using `NativeStackScreenProps` or similar.
    ```typescript
    export type RootStackParamList = {
      Home: undefined;
      Details: { itemId: number };
    };
    ```
*   **Structure:** Keep navigation logic (stacks, tabs) in `src/navigation`.
*   **Deep Linking:** Configure generic linking early for easy URL navigation support.

### 5. File Structure
```
src/
  ├── components/    # Dumb UI components
  ├── features/      # Feature-based modules (optional)
  ├── hooks/         # Custom hooks
  ├── navigation/    # Navigators & type definitions
  ├── screens/       # Screen components
  ├── stores/        # Zustand stores
  ├── services/      # API & side effects
  ├── theme/         # Colors, typography, spacing
  └── utils/         # Helpers & constants
```

### 6. Testing
*   Write unit tests for Utils and Stores (logic).
*   Write component tests for common UI components using `@testing-library/react-native`.

### 7. Package Management
*   **Tool:** Use **Yarn** exclusively. Do not use `npm`.
*   **Lockfile:** Always commit `yarn.lock`.

### 8. API & Error Handling
*   **Try/Catch Blocks:** All API calls within store actions MUST be wrapped in a `try/catch` block.
*   **Global Error Handling:** Use `useErrorStore.getState().showError()` to display user-friendly error messages for API failures.
    ```typescript
    // Example Action
    fetchData: async () => {
      set({ isLoading: true });
      try {
        const data = await api.get('/data');
        set({ data });
      } catch (error) {
        console.error(error);
        useErrorStore.getState().showError('Failed to fetch data.');
        set({ error: 'Failed to fetch data' });
      } finally {
        set({ isLoading: false });
      }
    }
    ```
