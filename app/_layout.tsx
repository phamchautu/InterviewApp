import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import GlobalErrorModal from '@/components/GlobalErrorModal';
import NavigationHeader from '@/components/NavigationHeader';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="MovieDetail"
          options={{
            headerShown: true,
            title: '',
            headerStyle: { backgroundColor: '#38a4fc' },
            headerTintColor: '#FFFFFF',
            header: (props) => <NavigationHeader {...props} />,
          }}
        />
      </Stack>
      <GlobalErrorModal />
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
