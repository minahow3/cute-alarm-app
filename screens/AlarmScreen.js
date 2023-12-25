import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, Text, Button } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const HomeScreen = () => {
  // 選択されたアラームの時間を保存するステート
  const [alarmTime, setAlarmTime] = useState(new Date());

  // DateTimePickerの表示状態を管理するステート
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 選択された日時の変更を処理する関数
  const handleDateChange = (event, selectedDate) => {
    // DateTimePickerを閉じる
    setShowDatePicker(false);

    // 有効な日時が選択された場合、アラームの時間を更新
    if (selectedDate) {
      setAlarmTime(selectedDate);
    }
  };

  // DateTimePickerを表示する関数
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView>
      {/* DateTimePickerを表示するためのボタン */}
      <Text>アラームの時間を選択してください:</Text>
      <Button title="時間を選択" onPress={showDatePickerModal} />

      {/* DateTimePickerコンポーネント */}
      {showDatePicker && (
        <DateTimePicker
          value={alarmTime}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      {/* 選択されたアラームの時間を表示するテキスト */}
      <Text>選択されたアラームの時間: {alarmTime.toLocaleTimeString()}</Text>

      {/* 選択されたアラームの時間を保存するボタン */}
      <Button
        title="アラームを保存"
        onPress={() => console.log("アラームが保存されました！", alarmTime)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
