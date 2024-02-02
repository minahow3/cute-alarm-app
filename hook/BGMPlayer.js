// BGMPlayer.js
import React, { useEffect, useRef } from "react";
import { Audio } from "expo-av";
import { useAppContext } from "../hook/AppContext";

const BGMPlayer = () => {
  const { bgmVolume } = useAppContext();
  const soundObjectRef = useRef();

  useEffect(() => {
    const playBackgroundMusic = async () => {
      try {
        if (soundObjectRef.current) {
          // すでにインスタンスが存在する場合、アンロード
          await soundObjectRef.current.unloadAsync();
        }

        // 新しい Audio.Sound インスタンスを作成
        soundObjectRef.current = new Audio.Sound();

        // BGM のロード
        await soundObjectRef.current.loadAsync(require("../voice/bgm.mp3"));

        // 音量の設定
        await soundObjectRef.current.setVolumeAsync(bgmVolume);

        // BGM の再生
        await soundObjectRef.current.playAsync();

        // BGM の再生が終了したときに再生を再開
        soundObjectRef.current.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            // 再生が終了した場合、再度再生を開始
            await soundObjectRef.current.replayAsync();
          }
        });
      } catch (error) {
        console.error("BGM の制御中にエラーが発生しました", error);
      }
    };

    playBackgroundMusic();

    // コンポーネントがアンマウントされた時にクリーンアップ
    return async () => {
      try {
        if (soundObjectRef.current) {
          await soundObjectRef.current.stopAsync();
          await soundObjectRef.current.unloadAsync();
        }
      } catch (error) {
        console.error("BGM のアンロード中にエラーが発生しました", error);
      }
    };
  }, [bgmVolume]); // bgmVolume の変更を監視

  return null; // BGMPlayer コンポーネント自体は何もレンダリングしない
};

export default BGMPlayer;
