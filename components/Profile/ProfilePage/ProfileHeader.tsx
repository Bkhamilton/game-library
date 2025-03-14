import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View, TouchableOpacity } from '@/components/Themed';
import { FontAwesome5, FontAwesome6, AntDesign } from '@expo/vector-icons';
import useTheme from '@/hooks/useTheme';
import { insertUser } from '@/db/Users/Users';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';

export default function ProfileHeader() {
    
    const { text } = useTheme();

    const db = useSQLiteContext();

    const router = useRouter();

    const handleSettings = () => {
        router.navigate('/profile/settings');
    }

    const onPress = async () => {
        await db.execAsync(`
            DROP TABLE Scores;
        `);
        await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gameId INTEGER NOT NULL,
                score INTEGER NOT NULL,
                metric TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (gameId) REFERENCES Games(id)
            ); 
        `);
        console.log('Scores table created');
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
                <Text style={{ fontSize: 22, fontWeight: '500', marginLeft: 14, }}>Profile</Text>
            </View>
            <TouchableOpacity
                onPress={handleSettings}
            >
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