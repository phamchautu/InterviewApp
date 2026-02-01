import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Modal, 
  TouchableWithoutFeedback, 
  ViewStyle, 
  Platform,
  SafeAreaView
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Theme } from '@/theme/constants';

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
  containerStyle?: ViewStyle;
}

const ModalSelect: React.FC<Props> = ({ 
  options, 
  selectedValue, 
  onSelect, 
  onClear, 
  placeholder, 
  containerStyle 
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (value: string) => {
    onSelect(value);
    setModalVisible(false);
  };

  const handleClear = (e: any) => {
    e.stopPropagation();
    if (onClear) onClear();
  };

  return (
    <>
      <View style={[styles.triggerContainer, containerStyle]}>
        <TouchableOpacity 
          style={styles.header} 
          onPress={() => setModalVisible(true)}
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
            <Ionicons name="chevron-down" size={20} color={Theme.colors.text} />
          </View>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <SafeAreaView>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{placeholder || 'Select an option'}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.optionsList}>
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
                          {isActive && (
                            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
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
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    marginRight: 8,
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333333',
  },
  doneText: {
    fontSize: 16,
    color: '#00B4E4',
    fontWeight: '600',
  },
  optionsList: {
    padding: 16,
  },
  optionItem: {
    minHeight: 48,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  optionActive: {
    backgroundColor: '#00B4D8',
  },
  optionInactive: {
    backgroundColor: '#F6F6F6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  textActive: {
    color: '#FFFFFF',
  },
  textInactive: {
    color: '#333333',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default ModalSelect;
