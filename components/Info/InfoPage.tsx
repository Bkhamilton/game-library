import React, { useContext } from 'react';
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View, ScrollView, TouchableOpacity } from "@/components/Themed";
import { useRouter } from 'expo-router';
import { DBContext } from '@/contexts/DBContext';
import InfoCard from '@/components/Info/InfoCard';
import useTheme from '@/hooks/useTheme';

export default function InfoPage() {
    
    const router = useRouter();

    const { primary, secondary } = useTheme();

    const { games } = useContext(DBContext);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Game Library</Text>
                <Text style={styles.headerSubtitle}>
                    Explore all available games
                </Text>
            </View>
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {games.map((game, index) => (
                    <InfoCard key={index} game={game} />
                ))}
            </ScrollView>
            <TouchableOpacity 
                style={[styles.closeButton, { backgroundColor: secondary, borderColor: primary }]}
                onPress={() => router.back()}
            >
                <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            {/* Use a light status bar on iOS to account for the black space above the modal */}
            <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      paddingTop: 60,
      paddingBottom: 20,
      paddingHorizontal: 20,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 16,
      opacity: 0.7,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    closeButton: {
      marginHorizontal: 20,
      padding: 16,
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 16,
      marginBottom: 20,
    },
    closeButtonText: {
      fontSize: 18,
      fontWeight: '500',
    }
});