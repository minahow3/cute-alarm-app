import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [bounceValue] = useState(new Animated.Value(1));

  const handleCharacterPress = () => {
    // バウンスアニメーション
    Animated.sequence([
      Animated.timing(bounceValue, {
        duration: 200,
        toValue: 1.05,
        useNativeDriver: false,
      }),
      Animated.spring(bounceValue, {
        toValue: 1.0,
        friction: 4,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formattedTime = `${currentTime.getHours()}:${currentTime.getMinutes()}`;
  const formattedDate = `${currentTime.toDateString()}`;

  return (
    <View style={styles.container}>
      <View style={styles.dateTimeContainer}>
        <Text style={styles.timeText}>{formattedTime}</Text>
        <Text style={[styles.dateText, { zIndex: 2 }]}>{formattedDate}</Text>
      </View>
      <View style={styles.contents}>
        <Image source={require("../assets/arr_left.png")} style={styles.icon} />
        <TouchableOpacity onPress={handleCharacterPress} activeOpacity={1.0}>
          <Animated.Image
            source={require("../assets/girl2.png")}
            style={[styles.character, { transform: [{ scale: bounceValue }] }]}
          />
        </TouchableOpacity>
        <Image
          source={require("../assets/arr_right.png")}
          style={styles.icon}
        />
      </View>
      <View style={styles.bar}>
        <MaterialIcons
          name="settings"
          size={30}
          style={{ backgroundColor: "#FFEBEB" }}
          onPress={() => navigation.navigate("Config")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFEBEB",
  },
  dateTimeContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    alignItems: "flex-start",
    padding: 10,
    zIndex: 1, // zIndex を追加
  },
  bar: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
  },
  contents: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 0,
  },
  character: {
    width: 580, // 任意の幅を設定
    height: 580, // 任意の高さを設定
    resizeMode: "contain",
    marginTop: 60,
    // borderWidth: 1, // 枠線の幅を指定
    // borderColor: "black", // 枠線の色を指定
  },
  icon: {
    width: 25,
    height: 25,
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
    // fontFamily: "MPLUSRounded1c_700Bold'", // フォントファミリー名はフォントファイルに依存します
  },
  dateText: {
    fontSize: 14,
    color: "gray",
    zIndex: 2, // zIndex を追加
  },
});

export default HomeScreen;
