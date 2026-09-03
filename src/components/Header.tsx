import React from 'react';
import { StyleSheet, View, Image, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Images } from '@/assets';

interface Props {
  style?: ViewStyle;
}

const Header: React.FC<Props> = ({ style }) => {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.safeArea, style]}>
      <View style={styles.container}>
        <Image 
          source={Images.logo} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  container: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  logo: {
    height: 40,
    width: 120, // Adjusted for a typical logo header size
  },
});

export default Header;
