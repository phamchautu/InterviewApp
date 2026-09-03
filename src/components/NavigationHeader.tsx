import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '@/theme/constants';

interface Props extends NativeStackHeaderProps {
  // Add any extra props if needed
}

const NavigationHeader: React.FC<Props> = ({ navigation, options, route, back }) => {
  const title = options.headerTitle !== undefined 
    ? options.headerTitle 
    : options.title !== undefined 
      ? options.title 
      : route.name;

  const flattenedStyle = StyleSheet.flatten(options.headerStyle) as { backgroundColor?: string } | undefined;
  const backgroundColor = flattenedStyle?.backgroundColor || 'rgba(0, 0, 0, 0.15)';
  const tintColor = options.headerTintColor || Theme.colors.text;

  return (
    <View style={[styles.containerWrapper, { backgroundColor }]}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {back ? (
            <TouchableOpacity 
              onPress={() => navigation.goBack()} 
              activeOpacity={0.7}
              style={styles.backButton}
            >
              <Ionicons 
                name="chevron-back" 
                size={28} 
                color={tintColor} 
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: tintColor }]} numberOfLines={1}>
            {typeof title === 'string' ? title : ''}
          </Text>
        </View>

        <View style={styles.rightContainer}>
          {/* Placeholder for right side elements */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    // Background dynamic
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 4,
    alignItems: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
});

export default NavigationHeader;
