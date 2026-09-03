import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Theme } from '@/theme/constants';

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onClear?: () => void; // Added onClear prop
  label?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

const Select: React.FC<Props> = ({ options, selectedValue, onSelect, onClear, label, placeholder, containerStyle }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected option object to display its label in the header
  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleClear = (e: any) => {
    e.stopPropagation(); // Prevent toggling the dropdown
    if (onClear) onClear();
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Header / Trigger */}
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleOpen}
        activeOpacity={0.7}
      >
        <Text style={styles.headerText}>
          {selectedOption ? selectedOption.label : (placeholder || 'Select...')}
        </Text>
        <View style={styles.iconContainer}>
          {selectedValue && onClear && (
            <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Theme.colors.text} 
          />
        </View>
      </TouchableOpacity>

      {/* Dropdown Content */}
      {isOpen && (
        <View style={styles.dropdownContent}>
          <View style={styles.divider} />
          <View style={styles.listContainer}>
            {options.map((option) => {
              const isActive = option.value === selectedValue;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionItem,
                    isActive ? styles.optionActive : styles.optionInactive
                  ]}
                  onPress={() => handleSelect(option.value)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.optionText,
                    isActive ? styles.textActive : styles.textInactive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    marginHorizontal: 0,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    borderRadius: 4, // Match container
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 8,
    padding: 4,
  },
  headerText: {
    fontSize: 14, // Smaller text
    fontWeight: '500', // Not bold
    color: '#333333',
  },
  dropdownContent: {
    paddingBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 12,
    marginBottom: 8,
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  optionItem: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'flex-start', // Align text to the left
    borderRadius: 4, // Updated from 24 (pill) to 4
    marginBottom: 4,
    paddingHorizontal: 12,
  },
  optionActive: {
    backgroundColor: '#00B4D8',
  },
  optionInactive: {
    backgroundColor: '#f9f9f9',
  },
  optionText: {
    fontSize: 14, // Smaller text
    fontWeight: '400', // Normal weight
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
    color: '#333333',
  },
});

export default Select;
