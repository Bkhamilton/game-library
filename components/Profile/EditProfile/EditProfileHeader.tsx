import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5, FontAwesome6, AntDesign } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { useRouter } from 'expo-router';

export default function EditProfileHeader() {
    
    const { text } = useTheme();

    const router = useRouter();

    const handleSettings = () => {
        router.navigate('/profile/settings');
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ padding: 8 }}
                >
                    <FontAwesome5 name="chevron-left" size={24} color={text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: '500', marginLeft: 14, }}>Edit Profile</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        paddingHorizontal: 20,
        justifyContent: 'center'
    },
});