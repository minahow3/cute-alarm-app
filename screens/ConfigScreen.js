import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { useAppContext } from "../hook/AppContext";

const ConfigScreen = () => {
  const { bgmVolume, setBgmVolume } = useAppContext();
  const [sliderValue, setSliderValue] = useState(bgmVolume);

  const handleVolumeChange = (value) => {
    // スライダーの値を更新
    setSliderValue(value);

    // 追加: ログを出力
    console.log(`スライダーの値が変更されました。新しい値: ${value}`);
  };

  const handleVolumeChangeComplete = async () => {
    try {
      // 音量の変更
      setBgmVolume(sliderValue);

      // 追加: ログを出力
      console.log("背景音楽の音量が変更されました。新しい値:", sliderValue);
    } catch (error) {
      console.error("音量の変更中にエラーが発生しました:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>背景音楽の音量</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.2}
        value={sliderValue}
        onValueChange={handleVolumeChange}
        onSlidingComplete={handleVolumeChangeComplete}
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
