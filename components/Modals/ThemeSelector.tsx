import React from 'react';
import { StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useThemeContext } from '@/contexts/ThemeContext';
import { GameTheme } from '@/constants/Themes';

interface ThemeSelectorProps {
  visible: boolean;
  close: () => void;
}

export default function ThemeSelector({ visible, close }: ThemeSelectorProps) {
  const { availableThemes, themeId, setTheme } = useThemeContext();

  const handleSelectTheme = (selectedThemeId: string) => {
    setTheme(selectedThemeId);
    // Don't close the modal yet - let user see the selection
    // In future, this will actually apply the theme
  };

  const renderThemeBox = (theme: GameTheme) => {
    const isSelected = theme.id === themeId;
    
    return (
      <TouchableOpacity
        key={theme.id}
        style={styles.themeBoxContainer}
        onPress={() => handleSelectTheme(theme.id)}
      >
        <View
          style={[
            styles.themeBox,
            { 
              backgroundColor: theme.colors.primary,
              borderWidth: isSelected ? 4 : 2,
              borderColor: isSelected ? theme.colors.accent : theme.colors.border,
            }
          ]}
        >
          <View style={[styles.colorPreview, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.colorSample, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.colorSample, { backgroundColor: theme.colors.secondary }]} />
            <View style={[styles.colorSample, { backgroundColor: theme.colors.accent }]} />
          </View>
        </View>
        <Text style={[styles.themeLabel, isSelected && styles.selectedLabel]}>
          {theme.name}
        </Text>
        {isSelected && (
          <Text style={styles.selectedIndicator}>✓ Selected</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={close}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Theme</Text>
            <TouchableOpacity onPress={close} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            contentContainerStyle={styles.themesContainer}
            showsVerticalScrollIndicator={false}
          >
            {availableThemes.map(theme => renderThemeBox(theme))}
          </ScrollView>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Theme selection UI ready. Theme application coming soon!
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#666',
  },
  themesContainer: {
    paddingVertical: 10,
  },
  themeBoxContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  themeBox: {
    width: 200,
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  colorPreview: {
    flexDirection: 'row',
    width: '80%',
    height: '40%',
    borderRadius: 8,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 10,
  },
  colorSample: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  themeLabel: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: '600',
  },
  selectedLabel: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  selectedIndicator: {
    marginTop: 4,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  footer: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
