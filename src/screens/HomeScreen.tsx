import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Images } from '../assets';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Image 
        source={Images.logo} 
        style={styles.logo} 
        resizeMode="contain" 
      />
      <Text style={styles.text}>Welcome to InterviewApp</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
