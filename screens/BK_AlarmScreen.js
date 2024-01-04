import React, { useState, useEffect ,useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button,Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Audio } from 'expo-av';
import alarmSound from '../voice/voice1.mp3'; // ファイルのパスを正しく指定
import AlarmRingingScreen from './AlarmRingingScreen';

const AlarmScreen = () => {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [alarmRinging, setAlarmRinging] = useState(false);
  const [isAlarmTime, setIsAlarmTime] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date()); // 追加

  const sound = new Audio.Sound();
  const isComponentMounted = useRef(true);

  useEffect(() => {
    return () => {
      // コンポーネントがアンマウントされる時にサウンドをアンロード
      isComponentMounted.current = false;
      sound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    // 現在の時刻を1秒ごとに更新するタイマーをセット
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
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
    // 毎回設定されるアラームの秒数を0に設定
    const newAlarmTime = new Date(date);
    newAlarmTime.setSeconds(0);

    setSelectedTime(newAlarmTime);
    const currentTime = new Date();
    if (
      newAlarmTime.getHours() === currentTime.getHours() &&
      newAlarmTime.getMinutes() === currentTime.getMinutes() &&
      newAlarmTime.getSeconds() === currentTime.getSeconds()
    ) {
      setIsAlarmTime(true);
    }
  };

  const handleStopAlarm = () => {
    setAlarmRinging(false); // アラーム停止ボタンが押されたら新しい画面を非表示
    setIsAlarmTime(false);
  };
  const handleSave = async () => {
    hideDateTimePicker();
    console.log('保存されました:', selectedTime);

    const currentDate = new Date();
    const timeDifference = selectedTime.getTime() - currentDate.getTime();
    console.log('差分:', timeDifference);

    // アラームを設定する場合、ここで設定された時間に音声を再生する処理を呼び出す
    await setAlarm(selectedTime);
  };

  const setAlarm = async (alarmTime) => {
    const currentDate = new Date();
    const timeDifference = alarmTime.getTime() - currentDate.getTime();
      if (timeDifference > 0) {
      // アラームの設定時間が未来の場合
      setTimeout(async () => {
        // 鳴らす前にコンポーネントがアンマウントされていないか確認
        if (!isComponentMounted.current) return;
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
        <Text style={styles.timeText}>現在の時刻: {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</Text>
        <TouchableOpacity onPress={showDateTimePicker}>
          <Text style={styles.timeText}>
            アラーム時刻: {selectedTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
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
      <Modal visible={isAlarmTime} animationType="slide">
        <AlarmRingingScreen
          alarmTime={selectedTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          onStopAlarm={handleStopAlarm}
        />
      </Modal>
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
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AlarmScreen;