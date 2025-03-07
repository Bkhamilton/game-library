import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { UserContext } from '@/contexts/UserContext';
import useTheme from '@/hooks/useTheme';

interface SettingsOptionsProps {
    onSelect: (title: string) => void;
}

interface SettingsOptionProps {
    icon: string;
    title: string;
    pressIcon: string;
    onSelect: () => void;
}

export default function SettingsOptions({ onSelect } : SettingsOptionsProps) {

    const { text } = useTheme();

    function SettingsOption({ icon, title, pressIcon, onSelect } : SettingsOptionProps) {
        return (
            <View style={styles.optionContainer}>
                <TouchableOpacity 
                    style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                    onPress={onSelect}
                >
                    <Ionicons name={icon} size={18} color={text} />
                    <Text style={styles.optionText}>{title}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={{ addingHorizontal: 6, paddingVertical: 6 }}
                    onPress={onSelect}    
                >
                    <FontAwesome5 name={pressIcon} size={24} color={text} />
                </TouchableOpacity>
            </View>
        );
    }

    const accountData = [
        { icon: 'trash', title: 'Clear User Data', pressIcon: 'chevron-right' },
        { icon: 'help-circle', title: 'Help', pressIcon: 'chevron-right' },
        { icon: 'information-circle', title: 'About', pressIcon: 'chevron-right' },
        { icon: 'cash', title: 'Support Us', pressIcon: 'chevron-right' },
    ]

    return (
        <View style={{ paddingVertical: 20 }}>
            {accountData.map((item) => (
                <View key={item.title} style={{ marginVertical: 4 }}>
                    <SettingsOption
                        icon={item.icon}
                        title={item.title}
                        pressIcon={item.pressIcon}
                        onSelect={() => onSelect(item.title)}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
  optionContainer: {
    paddingVertical: 6,
    paddingLeft: 20,
    paddingRight: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    paddingLeft: 6,
  },
});
  