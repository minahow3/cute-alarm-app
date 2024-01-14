import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Audio } from "expo-av";
import { useAppContext } from "../hook/AppContext.js";

const HistoryScreen = ({ route }) => {
  console.log(route);
  const { markedDates, setMarkedDates, phrases, setPhrases } = useAppContext(); // AppContextからデータを取得

  useEffect(() => {
    // アラームが止まった情報があればカレンダーを更新
    if (route.params?.alarmStopped) {
      // playedPhraseIndexはアラーム画面で再生されたセリフのindexを示す
      console.log(route.params?.playedPhraseIndex);
      updatePhraseAchieved(route.params?.playedPhraseIndex);
      updateCalendar(); // カレンダー更新関数の呼び出し
    }
  }, [route.params?.alarmStopped, route.params?.playedPhraseIndex]);

  const updateCalendar = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;
    // カレンダーの日付を更新
    setMarkedDates((prevMarkedDates) => {
      return {
        ...prevMarkedDates,
        [formattedDate]: { selected: true, marked: true, dotColor: "green" },
      };
    });
  };

  //   const markedDates = {
  //   "2023-12-01": { selected: true, marked: true, dotColor: "green" }, // 今日
  //   "2023-11-30": { selected: true, marked: true, dotColor: "green" }, // 昨日
  // };

  const updatePhraseAchieved = (playedPhraseIndex) => {
    if (playedPhraseIndex !== null && playedPhraseIndex !== undefined) {
      const updatedPhrases = [...phrases];
      // playedPhraseIndexに対応するセリフが存在し、かつ未達成の場合
      if (
        updatedPhrases[playedPhraseIndex] &&
        !updatedPhrases[playedPhraseIndex].achieved
      ) {
        updatedPhrases[playedPhraseIndex].achieved = true;
        setPhrases(updatedPhrases);
      }
    }
  };

  const renderPhraseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.phraseItem}
      onPress={() => handlePhrasePress(item.id, item.achieved)}
    >
      <Text>{item.achieved ? item.text : "???"}</Text>
    </TouchableOpacity>
  );

  const handlePhrasePress = (voiceIndex, isAchieved) => {
    playAudio(voiceIndex, isAchieved);
  };

  const playAudio = async (voiceIndex, isAchieved) => {
    // achieved が false の場合は再生しない
    if (!isAchieved) {
      return;
    }

    try {
      console.log("playing");
      const voiceFiles = {
        1: require("../voice/voice1.mp3"),
        2: require("../voice/voice2.mp3"),
        3: require("../voice/voice3.mp3"),
        4: require("../voice/voice4.mp3"),
        5: require("../voice/voice5.mp3"),
        6: require("../voice/voice6.mp3"),
        7: require("../voice/voice7.mp3"),
        8: require("../voice/voice8.mp3"),
        9: require("../voice/voice9.mp3"),
        10: require("../voice/voice10.mp3"),
      };

      const { sound } = await Audio.Sound.createAsync(voiceFiles[voiceIndex], {
        shouldPlay: true,
      });

      // 再生が終了したらアンロード
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("音声の再生中にエラーが発生しました", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 上部：カレンダー */}
      <View style={styles.calendarContainer}>
        <Calendar
          markedDates={markedDates}
          // その他のプロパティ
        />
      </View>

      {/* 下部：セリフ一覧 */}
      <View style={styles.phrasesContainer}>
        {phrases.length > 0 ? (
          <FlatList
            data={phrases}
            renderItem={renderPhraseItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>獲得したセリフがありません</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    // カレンダーコンポーネントのスタイル
  },
  phrasesContainer: {
    flex: 1,
    padding: 10,
  },
  phraseItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 10,
  },
});

export default HistoryScreen;
