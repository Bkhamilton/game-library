import React from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";

import GoGoBird from "@/components/Home/GoGoBird/GoGoBirdGame";

export default function GoGoBirdScreen() {
  return (
    <View style={styles.container}>
      <GoGoBird />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});
