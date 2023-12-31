import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import alarmSound from '../voice/voice1.mp3'; // ファイルのパスを正しく指定

const AlarmScreen = () => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const sound = new Audio.Sound();
  console.log(alarmSound)


  useEffect(() => {
    return () => {
      // コンポーネントがアンマウントされる時にサウンドをアンロード
      sound.unloadAsync();
    };
  }, []);

  const showDateTimePicker = () => {
    setShowPicker(true);
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  const handleDateChange = (event, date) => {
    setSelectedTime(date);
  };

  const handleSave = async () => {
    hideDateTimePicker();
    console.log('保存されました:', selectedTime);

    // アラームを設定する場合、ここで設定された時間に音声を再生する処理を呼び出す
    await setAlarm(selectedTime);
  };

  const setAlarm = async (alarmTime) => {
    const currentDate = new Date();
    const timeDifference = alarmTime.getTime() - currentDate.getTime();

    if (timeDifference > 0) {
      // アラームの設定時間が未来の場合
      setTimeout(async () => {
        // 指定の音声を再生
        await playAlarmSound();
      }, timeDifference);
    }
  };

  const playAlarmSound = async () => {
    try {
      // サウンドを読み込む
      await sound.loadAsync(alarmSound);

      // サウンドを再生
      await sound.playAsync();
    } catch (error) {
      console.error('音声ファイルの読み込みまたは再生に失敗しました', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>アラーム</Text>
      </View>
      <View style={styles.timeContainer}>
        <TouchableOpacity onPress={showDateTimePicker}>
          <Text style={styles.timeText}>
            {selectedTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </TouchableOpacity>
        {showPicker && (
          <>
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={true}
              display="spinner"
              onChange={handleDateChange}
            />
            <Button title="保存" onPress={handleSave} />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  timeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default AlarmScreen;
