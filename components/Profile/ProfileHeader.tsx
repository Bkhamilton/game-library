import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5, FontAwesome6, AntDesign } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';

export default function ProfileHeader() {
    
    const { text } = useTheme();

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity>
                    <FontAwesome5 name="chevron-left" size={24} color={text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: '500', marginLeft: 14, }}>Profile</Text>
            </View>
            <AntDesign name="setting" size={28} color={text} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        width: '100%',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
});