import React, { useEffect } from "react";
import { Audio } from "expo-av";

const BGMPlayer = () => {
  useEffect(() => {
    const playBackgroundMusic = async () => {
      const soundObject = new Audio.Sound();

      try {
        await soundObject.loadAsync(require("../voice/bgm.mp3"));

        // 音量を設定（例: 0.5は半分の音量）
        await soundObject.setVolumeAsync(0.1);

        await soundObject.playAsync();

        // BGM の再生が終了するまで待機
        await soundObject.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            await soundObject.unloadAsync();
          }
        });
      } catch (error) {
        console.error("BGM の再生中にエラーが発生しました", error);
      }
    };

    playBackgroundMusic();

    // コンポーネントがアンマウントされた時にクリーンアップ
    return () => {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      });
    };
  }, []);

  return null; // BGMPlayer コンポーネント自体は何もレンダリングしない
};

export default BGMPlayer;
