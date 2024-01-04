import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity,Switch, StyleSheet, Image,Button} from 'react-native';
import { Audio } from 'expo-av';
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modal';

const AlarmScreen = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alarms, setAlarms] = useState([
    { time: new Date(), isActive: false },
    { time: new Date(), isActive: false },
    { time: new Date(), isActive: false },
  ]);
  const [showPicker, setShowPicker] = useState(false);
  const [sound, setSound] = useState();
  const [alarmRinging, setAlarmRinging] = useState(false);
  const [selectedAlarmIndex, setSelectedAlarmIndex] = useState(0);
  const [editedAlarmIndex, setEditedAlarmIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [alarmIntervalId, setAlarmIntervalId] = useState(null)

  useEffect(() => {
    // 現在時刻の更新とアラームのチェックを1秒ごとに行う
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
      checkAlarms();
    }, 1000);

    // コンポーネントのアンマウント時にクリーンアップ
    return () => {
      clearInterval(intervalId);
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [alarms, sound]);

  const showDateTimePicker = (index) => {
    setShowPicker(true);
    setEditedAlarmIndex(index);
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  // アラーム更新
  const handleDateChange = (event, date) => {
    const updatedAlarms = [...alarms];
    updatedAlarms[editedAlarmIndex].time = date;
    setAlarms(updatedAlarms);
  };
  const handleSave = () => {
    hideDateTimePicker();
    // ここでアラームの時間を保存するなどの処理を行う
    console.log('保存されました:', alarms[editedAlarmIndex].time);
  };

  const toggleAlarm = (index) => {
    const updatedAlarms = [...alarms];
    updatedAlarms[index].isActive = !updatedAlarms[index].isActive;
    setAlarms(updatedAlarms);
  };

  const checkAlarms = async () => {
    for (const alarm of alarms) {
      const alarmTime = alarm.time;
      const currentTime = new Date();

      // アラームの設定された時間（時、分）が現在の時間と一致するかどうかを確認
      if (
        alarm.isActive &&
        alarmTime.getHours() === currentTime.getHours() &&
        alarmTime.getMinutes() === currentTime.getMinutes()
      ) {
        console.log('checkAlarms');
        alarm.isActive = !alarm.isActive;
        setShowPopup(true); // アラームが鳴っている場合、ポップアップを表示
        // 10秒ごとに音声を再生
        const intervalId = setInterval(() => {
          playAlarmSound();
        }, 10000);

        // 1分後に音声再生を停止
        setTimeout(() => {
          clearInterval(intervalId);
          setShowPopup(false);
          stopAlarm();
        }, 60000);

        // stopAlarm() を呼ぶために intervalId を state に保存
        setAlarmIntervalId(intervalId);
      }
    }
  };

  const playAlarmSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../voice/voice1.mp3'),
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (error) {
      console.error('音声ファイルの読み込みまたは再生に失敗しました', error);
    }
  };

  const stopAlarm = async () => {
    if (sound) {
      clearInterval(alarmIntervalId); // インターバルの停止
      await sound.unloadAsync();
    }
  };

  const handlePopupButtonPress = (stopAlarm) => {
    setShowPopup(false);
    if (stopAlarm) {
      stopAlarm();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>アラーム</Text>
        <Text style={styles.currentTimeText}>
          現在の時刻: {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </Text>
      </View>
      <View style={styles.alarmsContainer}>
        {alarms.map((alarm, index) => (
          <View key={index} style={styles.alarmItem}>
            <Text style={styles.alarmTimeText}>
              アラーム {index + 1} :  {alarm.time.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <TouchableOpacity onPress={() => showDateTimePicker(index)}>
              <Image source={require('../assets/edit.png')} style={styles.editIcon} />
            </TouchableOpacity>
            <Switch
              value={alarm.isActive}
              onValueChange={() => toggleAlarm(index)}
              thumbColor={alarm.isActive ? 'white' : 'white'}
              trackColor={{ false: '#8E8E93', true: '#007AFF' }}
              ios_backgroundColor="#8E8E93"
            />
          </View>
        ))}
      </View>
      {showPicker && (
        <>
        <DateTimePicker
          value={alarms[selectedAlarmIndex].time}
          mode="time"
          is24Hour={true}
          display="spinner"
          onChange={handleDateChange}
          />
          <Button title="保存" onPress={handleSave} />
        </>
      )}
      {showPopup && (
        <Modal isVisible={showPopup} style={styles.modal}>
          <View style={styles.popupContainer}>
            <Text style={styles.popupText}>アラームを停止しますか？</Text>
            <TouchableOpacity
              style={[styles.popupButton, { backgroundColor: '#007AFF' }]}
              onPress={() => handlePopupButtonPress(stopAlarm)}
            >
              <Text style={styles.popupButtonText}>はい</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
      }

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
  currentTimeText: {
    fontSize: 18,
    marginTop: 10,
  },
  alarmsContainer: {
    marginTop: 20,
  },
  alarmItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin:15
  },
  alarmTimeText: {
    fontSize: 18,
  },
  editIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  alarmToggleIcon: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
  stopAlarmContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopAlarmText: {
    fontSize: 18,
    marginBottom: 20,
  },
  stopAlarmButton: {
    fontSize: 18,
    color: 'blue',
  },
  // ポップアップ用のスタイル
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'white',
  },
  popupButton: {
    padding: 10,
    borderRadius: 5,
  },
  popupButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default AlarmScreen;