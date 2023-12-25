import React from "react";
import { View, Text, Button, StyleSheet, SafeAreaView } from "react-native";

const HomeScreen = ({ navigation }) => {
  console.log();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Button title="Homeへ" onPress={() => navigation.navigate("Home")} />
    </SafeAreaView>
  );
};

export default HomeScreen;
