import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5, FontAwesome6, AntDesign } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { insertUser } from '@/db/Users/Users';
import { useSQLiteContext } from 'expo-sqlite';

export default function ProfileHeader() {
    
    const { text } = useTheme();

    const db = useSQLiteContext();

    const onPress = async () => {
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                name TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        const user = {
            name: 'John Doe',
            username: 'johndoe',
        }
        await insertUser(db, user);
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => console.log('Back')}>
                    <FontAwesome5 name="chevron-left" size={24} color={text} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, fontWeight: '500', marginLeft: 14, }}>Profile</Text>
            </View>
            <TouchableOpacity>
                <AntDesign name="setting" size={28} color={text} />
            </TouchableOpacity>
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