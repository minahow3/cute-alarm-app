import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { LocaleConfig, CalendarList } from "react-native-calendars";
import { Audio } from "expo-av";
import { useAppContext } from "../hook/AppContext.js";

// react-native-calendarsの月の表示を左端に寄せるための設定（jaが日本語設定）
LocaleConfig.locales["ja"] = {
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  dayNames: ["日", "月", "火", "水", "木", "金", "土"],
  dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  today: "今日",
};
LocaleConfig.defaultLocale = "ja";

const HistoryScreen = ({ route }) => {
  // AppContextからデータを取得
  const { markedDates, setMarkedDates, phrases, setPhrases } = useAppContext();

  useEffect(() => {
    // アラームが止まった情報があればカレンダーを更新
    if (route.params?.alarmStopped) {
      // playedPhraseIndexはアラーム画面で再生されたセリフのindexを示す
      console.log(
        "アラームが停止されました。再生されたセリフのindex:",
        route.params?.playedPhraseIndex
      );
      updatePhraseAchieved(route.params?.playedPhraseIndex);
      updateCalendar(); // カレンダー更新関数の呼び出し
    }
  }, [route.params?.alarmStopped, route.params?.playedPhraseIndex]);

  // カレンダーを更新する関数
  const updateCalendar = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

    // マークされた日付を更新
    setMarkedDates((prevMarkedDates) => {
      const updatedMarkedDates = {
        ...prevMarkedDates,
        [formattedDate]: {
          selected: true,
          marked: true,
          selectedColor: "#facfde",
        },
      };
      console.log("カレンダーが更新されました。更新された日付:", formattedDate);

      return updatedMarkedDates;
    });
  };

  // セリフの達成状態を更新する関数
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
        console.log(`セリフ ${playedPhraseIndex + 1} が達成されました。`);
      }
    }
  };

  // セリフアイテムを描画する関数
  const renderPhraseItem = ({ item }) => (
    <TouchableOpacity
      style={styles.phraseItem}
      onPress={() => handlePhrasePress(item.id, item.achieved)}
    >
      <Text>{item.achieved ? item.text : "???"}</Text>
    </TouchableOpacity>
  );

  // セリフが押されたときの処理
  const handlePhrasePress = (voiceIndex, isAchieved) => {
    playAudio(voiceIndex, isAchieved);
  };

  // 音声を再生する関数
  const playAudio = async (voiceIndex, isAchieved) => {
    // achieved が false の場合は再生しない
    if (!isAchieved) {
      return;
    }

    try {
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
        <Text style={styles.calendarText}>カレンダー</Text>
        <CalendarList
          markedDates={markedDates}
          onAnimatedValueUpdate={() => {}}
          showScrollIndicator={true}
          showSixWeeks={true}
          hideExtraDays={false}
          calendarHeight={170}
          horizontal={true}
          pastScrollRange={3}
          futureScrollRange={3}
          monthFormat={"yyyy年M月"}
          theme={{
            weekVerticalMargin: 1.2,
          }}
          onVisibleMonthsChange={(months) => {
            // 月が切り替わったときに呼び出す
            console.log("表示されている月が変更されました:", months);
            updateCalendar();
          }}
          style={{
            backgroundColor: "white",
            width: "90%",
            margin: 20,
            borderRadius: 10,
          }}
        />
      </View>

      {/* 下部：セリフ一覧 */}
      <View style={styles.phrasesContainer}>
        {phrases.length > 0 ? (
          <FlatList
            data={phrases}
            renderItem={renderPhraseItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.flatList}
          />
        ) : (
          <Text style={styles.noPhrasesText}>獲得したセリフがありません</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFEBEB",
  },
  calendarContainer: {
    width: "100%",
  },
  calendarText: {
    marginLeft: 20,
    marginTop: 20,
  },
  phrasesContainer: {
    flex: 1,
    margin: 5,
    padding: 10,
  },
  phraseItem: {
    fontSize: 40,
    padding: 10,
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 10,
  },
});

export default HistoryScreen;
