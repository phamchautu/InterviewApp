import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { Theme } from '@/theme/constants';

interface Props extends TouchableOpacityProps {
  title: string;
  isActive?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<Props> = ({ title, isActive = false, onPress, style, textStyle, ...props }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.container,
        isActive ? styles.activeContainer : styles.inactiveContainer,
        style,
      ]}
      {...props}
    >
      <Text
        style={[
          styles.text,
          isActive ? styles.activeText : styles.inactiveText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 48,
    borderRadius: 20, // Default
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    // Optional shadow for buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeContainer: {
    backgroundColor: '#00B4D8', // Cyan active color
  },
  inactiveContainer: {
    backgroundColor: '#F6F6F6', // Light grey inactive
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  text: {
    fontSize: 16,
    fontWeight: '700', // Bold text
  },
  activeText: {
    color: '#FFFFFF',
  },
  inactiveText: {
    color: '#333333',
  },
});

export default Button;
