//AlarmScreen.js
import React, {
  useRef,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  StyleSheet,
  Image,
  Button,
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import DateTimePicker from "@react-native-community/datetimepicker";
import Modal from "react-native-modal";

import { useAppContext, convertStringToDate } from "../hook/AppContext.js";
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
  // 10: require("../voice/voice10.mp3"),
};

const AlarmScreen = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { alarms, setAlarms } = useAppContext();
  const [showPicker, setShowPicker] = useState(false);
  const [sound, setSound] = useState();
  const [selectedAlarmIndex, setSelectedAlarmIndex] = useState(0);
  const [editedAlarmIndex, setEditedAlarmIndex] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [alarmIntervalId, setAlarmIntervalId] = useState(null);
  const [randomIndex, setRandomIndex] = useState(null);
  const scrollViewRef = useRef(null);

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

    // DateTimePickerがレイアウトされた後に末尾にスクロール
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 0);
  };

  const hideDateTimePicker = () => {
    setShowPicker(false);
  };

  // アラーム更新
  const handleDateChange = (event, date) => {
    const updatedAlarms = [...alarms];
    updatedAlarms[editedAlarmIndex].time = date;
    setAlarms(updatedAlarms); // setAlarms を使用してステートを更新

    // 追加: ログを出力
    console.log(
      `アラーム ${editedAlarmIndex} を${
        updatedAlarms[editedAlarmIndex].isActive ? "有効化" : "無効化"
      }しました。`
    );
  };

  const handleSave = () => {
    hideDateTimePicker();
    // ここでアラームの時間を保存するなどの処理を行う
    console.log("保存されました:", alarms[editedAlarmIndex].time);
  };

  // アラームのON/OFF変更
  const toggleAlarm = (index) => {
    // editedAlarmIndexの初期値を設定
    if (editedAlarmIndex === null) {
      setEditedAlarmIndex(index);
    }

    const updatedAlarms = [...alarms];
    updatedAlarms[index].isActive = !updatedAlarms[index].isActive;
    setAlarms(updatedAlarms); // setAlarms を使用してステートを更新
    console.log(
      `アラーム ${selectedAlarmIndex} を${
        updatedAlarms[selectedAlarmIndex].isActive ? "有効化" : "無効化"
      }しました。`
    );
  };

  const checkAlarms = async () => {
    alarms.forEach((alarm, index) => {
      let alarmTime = convertStringToDate(alarm.time);
      const currentTime = new Date();

      // アラームの設定された時間（時、分）が現在の時間と一致するかどうかを確認
      if (
        alarm.isActive &&
        alarmTime.getHours() === currentTime.getHours() &&
        alarmTime.getMinutes() === currentTime.getMinutes()
      ) {
        alarm.isActive = !alarm.isActive;
        setShowPopup(true); // アラームが鳴っている場合、ポップアップを表示

        // ランダムなインデックスを取得
        const newIndex = Math.floor(Math.random() * 9) + 1; // 9個の音声ファイルがあると仮定

        setRandomIndex(newIndex - 1);
        // ランダムに選択された音声ファイルを再生
        playAlarmSound(voiceFiles[newIndex]);

        // 10秒ごとに音声を再生
        const intervalId = setInterval(() => {
          playAlarmSound(voiceFiles[newIndex]);
        }, 10000);

        // 1分後に音声再生を停止
        setTimeout(() => {
          clearInterval(intervalId);
          setShowPopup(false);
          stopAlarm();
        }, 59990);

        // stopAlarm() を呼ぶために intervalId を state に保存
        setAlarmIntervalId(intervalId);

        console.log(`アラーム ${index} が発動しました。`);
      }
    });
  };

  const playAlarmSound = async (file) => {
    try {
      const { sound } = await Audio.Sound.createAsync(file, {
        shouldPlay: true,
      });
      setSound(sound);
    } catch (error) {
      console.error("音声ファイルの読み込みまたは再生に失敗しました", error);
    }
  };

  const stopAlarm = async () => {
    if (sound) {
      clearInterval(alarmIntervalId); // インターバルの停止
      await sound.unloadAsync();

      // アラームが止まった情報をHistoryScreenに送信
      navigation.navigate("History", {
        alarmStopped: true,
        playedPhraseIndex: randomIndex,
      });
      console.log(`アラームが停止しました。`);
    }
  };

  const handlePopupButtonPress = (stopAlarm) => {
    setShowPopup(false);
    if (stopAlarm) {
      stopAlarm();
    }
  };

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Alarm</Text>
      </View>
      <View style={styles.alarmsContainer}>
        {alarms.map((alarm, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => showDateTimePicker(index)}
            style={styles.alarmItem}
          >
            <View style={styles.alarmTextContainer}>
              <Text style={styles.alarmTimeText}>
                {convertStringToDate(alarm.time).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <Text style={styles.alarmText}>アラーム</Text>
            </View>
            <Switch
              value={alarm.isActive}
              onValueChange={() => toggleAlarm(index)}
              trackColor={{ false: "#8E8E93", true: "#EF7FA7" }}
              ios_backgroundColor="#8E8E93"
              style={styles.materialSwitch}
            />
          </TouchableOpacity>
        ))}
      </View>
      {showPicker && (
        <>
          <DateTimePicker
            value={
              alarms[editedAlarmIndex]
                ? convertStringToDate(alarms[editedAlarmIndex].time)
                : new Date()
            }
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
              style={[styles.popupButton, { backgroundColor: "#007AFF" }]}
              onPress={() => handlePopupButtonPress(stopAlarm)}
            >
              <Text style={styles.popupButtonText}>はい</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  currentTimeText: {
    fontSize: 18,
    marginTop: 10,
  },
  alarmsContainer: {
    marginTop: 20,
  },
  alarmItem: {
    flexDirection: "row", // コンポーネントを横に配置する
    justifyContent: "space-between", // 左右にスペースを空ける
    alignItems: "center",
    margin: 15,
    paddingBottom: 10,
    borderBottomWidth: 1, // 一本の線を追加
    borderBottomColor: "#BEBEBE", // 線の色を指定
    paddingHorizontal: 10, // 左右の余白を追加
  },

  alarmTimeTextContainer: {
    flexDirection: "column", // 垂直方向に表示
  },
  alarmTimeText: {
    fontSize: 48,
    // borderWidth: 1,
    // borderColor: "black",
  },
  alarmTextContainer: {
    width: "75%",
    // borderWidth: 1,
    // borderColor: "blue",
    flexDirection: "column", // 垂直方向に表示
    marginLeft: 10, // 時間と"アラーム"文字の間にスペースを追加
  },
  alarmText: {
    fontSize: 16, // テキストのフォントサイズを指定
    color: "#282E31",
  },

  materialSwitch: {
    transform: [{ scaleX: 1 }, { scaleY: 1 }], // サイズを変更
    marginLeft: 10, // マージンを追加
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
    justifyContent: "center",
    alignItems: "center",
  },
  stopAlarmText: {
    fontSize: 18,
    marginBottom: 20,
  },
  stopAlarmButton: {
    fontSize: 18,
    color: "blue",
  },
  // ポップアップ用のスタイル
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "black",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  popupText: {
    fontSize: 18,
    marginBottom: 20,
    color: "white",
  },
  popupButton: {
    padding: 10,
    borderRadius: 5,
  },
  popupButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AlarmScreen;
