import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";

const HistoryScreen = ({ route }) => {
  console.log(route);
  const [markedDates, setMarkedDates] = useState({});
  const [phrases, setPhrases] = useState([
    {
      id: 1,
      text: "おはようございます。今日も一緒に素敵な1日を迎えましょう。",
      achieved: false,
    },
    { id: 2, text: "おはよう。なんでそんなに笑ってるの？", achieved: false },
    {
      id: 3,
      text: "すごいね。今日も目覚ましを1回で止めてくれてありがとう。",
      achieved: false,
    },
    { id: 4, text: "今日も君の笑顔とっても素敵だね。", achieved: false },
    {
      id: 5,
      text: "君の笑顔は私の元気の源なんだよ。おはよう。",
      achieved: false,
    },
    {
      id: 6,
      text: "おはよう。今日の予定はもう考えてる？なにしようね。",
      achieved: false,
    },
    {
      id: 7,
      text: "小さな一歩も大事だよね。君ならきっとできるはず！",
      achieved: false,
    },
    {
      id: 8,
      text: "君の笑顔は今日もきっとみんなを笑顔にできます。",
      achieved: false,
    },
    {
      id: 9,
      text: "成功は小さな積み重ねから。今日も一歩進んでいこう。",
      achieved: false,
    },
    {
      id: 10,
      text: "おはよう！今日の天気確認した？お出かけの時は気を付けてね。",
      achieved: false,
    },
  ]);

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
    <View style={styles.phraseItem}>
      <Text>{item.achieved ? item.text : "???"}</Text>
    </View>
  );

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
