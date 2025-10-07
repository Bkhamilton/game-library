import React, { useState } from 'react';
import { StyleSheet, Modal, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { Text, View, ClearView } from '@/components/Themed';
import { useThemeContext } from '@/contexts/ThemeContext';
import { GameTheme } from '@/constants/Themes';

interface ThemeSelectorProps {
    visible: boolean;
    close: () => void;
}

export default function ThemeSelector({ visible, close }: ThemeSelectorProps) {
    const { availableThemes, themeId, setTheme, useDefaultPhoneMode, setUseDefaultPhoneMode } = useThemeContext();

    const handleSelectTheme = (selectedThemeId: string) => {
        if (!useDefaultPhoneMode) {
            setTheme(selectedThemeId);
            // Don't close the modal yet - let user see the selection
            // In future, this will actually apply the theme
        }
    };

    const handleToggleDefaultMode = (value: boolean) => {
        setUseDefaultPhoneMode(value);
    };

    const renderThemeBox = (theme: GameTheme) => {
        const isSelected = theme.id === themeId;
        const isDisabled = useDefaultPhoneMode;
        
        return (
            <TouchableOpacity
                key={theme.id}
                style={styles.themeBoxContainer}
                onPress={() => handleSelectTheme(theme.id)}
                disabled={isDisabled}
            >
                <View
                    style={[
                        styles.themeSwatch,
                        {
                        backgroundColor: theme.colors.primary,
                        borderColor: isSelected ? theme.colors.accent : theme.colors.border,
                        borderWidth: isSelected ? 3 : 2,
                        opacity: isDisabled ? 0.4 : 1,
                        },
                    ]}
                />
                <Text numberOfLines={1} style={[
                    styles.themeLabel, 
                    isSelected && styles.selectedLabel,
                    isDisabled && styles.disabledLabel
                ]}>
                    {theme.name}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={close}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <ClearView style={styles.header}>
                        <Text style={styles.headerTitle}>Select Theme</Text>
                        <TouchableOpacity onPress={close} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>✕</Text>
                        </TouchableOpacity>
                    </ClearView>
                    
                    <ClearView style={styles.toggleContainer}>
                        <Text style={styles.toggleLabel}>Use Default Phone Mode</Text>
                        <Switch
                            value={useDefaultPhoneMode}
                            onValueChange={handleToggleDefaultMode}
                            trackColor={{ false: '#767577', true: '#007AFF' }}
                            thumbColor={useDefaultPhoneMode ? '#fff' : '#f4f3f4'}
                        />
                    </ClearView>

                    <ScrollView
                        horizontal
                        contentContainerStyle={styles.themesContainer}
                        showsHorizontalScrollIndicator={false}
                    >
                        {availableThemes.map((theme) => renderThemeBox(theme))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // Add a little top padding to avoid status bar
        paddingTop: 60,
    },
    modalContainer: {
        width: '90%',
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    closeButton: {
        padding: 4,
    },
    closeButtonText: {
        fontSize: 22,
        color: '#666',
    },
    themesContainer: {
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    themeBoxContainer: {
        alignItems: 'center',
        marginRight: 12,
    },
    themeSwatch: {
        width: 52,
        height: 52,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    themeLabel: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        maxWidth: 84,
    },
    selectedLabel: {
        fontWeight: '700',
        color: '#007AFF',
    },
    disabledLabel: {
        opacity: 0.4,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 4,
        marginBottom: 8,
    },
    toggleLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
});
