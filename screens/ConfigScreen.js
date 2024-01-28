// config.js
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useAppContext } from "../hook/AppContext";

const ConfigScreen = () => {
  const { bgmVolume, setBgmVolume } = useAppContext();

  const handleVolumeChange = (value) => {
    // 音量の変更
    setBgmVolume(value);
  };
  return (
    <View style={styles.container}>
      <Text>背景音楽の音量</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.2}
        value={bgmVolume}
        onValueChange={handleVolumeChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slider: {
    width: 200,
    height: 40,
  },
});

export default ConfigScreen;
