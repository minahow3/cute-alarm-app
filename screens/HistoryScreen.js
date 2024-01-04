import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Calendar } from "react-native-calendars";

const HistoryScreen = ({ route }) => {
  console.log(route);
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    // アラームが止まった情報があればカレンダーを更新
    if (route.params?.alarmStopped) {
      console.log(route.params?.alarmStopped);
      updateCalendar(); // カレンダー更新関数の呼び出し
    }
  }, [route.params?.alarmStopped]);

  const updateCalendar = () => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
    console.log(formattedDate);
    // カレンダーの日付を更新
    setMarkedDates((prevMarkedDates) => {
      return {
        ...prevMarkedDates,
        [formattedDate]: { selected: true, marked: true, dotColor: 'green' },
      };
    });
  };

  //   const markedDates = {
  //   "2023-12-01": { selected: true, marked: true, dotColor: "green" }, // 今日
  //   "2023-11-30": { selected: true, marked: true, dotColor: "green" }, // 昨日
  // };

  // セリフデータに獲得フラグを追加
  const phrases = [
    {
      id: 1,
      text: "おはようございます！今日も一緒に素敵な一日を迎えましょう♪",
      achieved: true,
    },
    {
      id: 2,
      text: "新しい一日の始まりだね！君の笑顔が見られて嬉しいよ！",
      achieved: false,
    },
    {
      id: 3,
      text: "素晴らしい！アラームを一発で止めてくれてありがとう！",
      achieved: true,
    },
    { id: 4, text: "朝の笑顔、とっても素敵ですね♪", achieved: false },
    { id: 5, text: "君の笑顔はこのアプリの元気の源だよ！", achieved: true },
    {
      id: 6,
      text: "君がこのアプリを選んでくれて感謝してるよ！",
      achieved: true,
    },
    {
      id: 7,
      text: "君のポジティブなエネルギーがここにも伝わってくるよ！",
      achieved: false,
    },
    // 他のセリフデータも同様に
  ];

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
