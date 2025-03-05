import React from 'react';
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import { Text, View, ScrollView, TouchableOpacity } from "@/components/Themed";
import { useRouter } from 'expo-router';

export default function InfoScreen() {

    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={{ width: "100%", padding: 20, alignItems: "center" }}>
                <Text style={styles.title}>Info</Text>
            </View>
            <ScrollView style={{ flex: 1, width: "100%" }}>
                <Text>Info content</Text>
            </ScrollView>
            <TouchableOpacity onPress={() => router.back()}>
                <Text>Close</Text>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
