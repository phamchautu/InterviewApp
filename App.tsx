import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from '@/navigation/RootNavigator';
import GlobalErrorModal from '@/components/GlobalErrorModal';
import Header from '@/components/Header';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="transparent" 
        translucent={true} 
      />
      <Header />
      <RootNavigator />
      <GlobalErrorModal />
    </SafeAreaProvider>
  );
}

export default App;