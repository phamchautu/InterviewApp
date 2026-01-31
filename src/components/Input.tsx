import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TextInput, View, TextInputProps, ViewStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '@/theme/constants';

interface Props extends TextInputProps {
  onSearch: (text: string) => void;
  debounceTime?: number;
  containerStyle?: ViewStyle;
}

const Input: React.FC<Props> = ({ onSearch, debounceTime = 2000, style, containerStyle, value, onChangeText, ...props }) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChangeText = (text: string) => {
    if (onChangeText) {
      onChangeText(text);
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onSearch(text);
    }, debounceTime);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons name="search" size={18} color="#8E8E93" style={styles.icon} />
      <TextInput
        {...props}
        style={[styles.input, style]}
        value={value}
        onChangeText={handleChangeText}
        placeholderTextColor="#8E8E93"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 44,
    // Matching Select component shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    height: '100%',
    padding: 0, // Reset default padding
  },
});

export default Input;
