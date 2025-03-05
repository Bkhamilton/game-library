import React, { useContext } from 'react';
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View, ScrollView, TouchableOpacity } from "@/components/Themed";
import { useRouter } from 'expo-router';
import { DBContext } from '@/contexts/DBContext';
import Disclosure from '@/components/Helpers/Disclosure';
import useTheme from '@/hooks/useTheme';

export default function InfoPage() {
    
    const router = useRouter();

    const { primary, secondary } = useTheme();

    const { games } = useContext(DBContext);

    return (
        <View style={styles.container}>
            <ScrollView style={{ flex: 1, width: "100%" }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', padding: 10 }}>Game List</Text>
                {games.map((game, index) => (
                    <Disclosure key={index} title={game.title} content={game.description}/>
                ))}
            </ScrollView>
            <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: secondary, borderColor: primary }]}
                onPress={() => router.back()}
            >
                <Text style={{ fontSize: 18, fontWeight: '500' }}>Close</Text>
            </TouchableOpacity>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    closeButton: {
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      width: '80%',
      borderRadius: 16,
      marginBottom: 20,
    }
});