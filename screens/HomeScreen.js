import React from "react";
import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Icon } from "react-native-elements";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Icon
          name="cog" // "cog"は歯車アイコンの名前です
          type="font-awesome" // アイコンの種類を指定します
          color="black" // アイコンの色を指定します
          size={30} // アイコンのサイズを指定します
          onPress={() => navigation.navigate("Config")}
        />
      </View>
      <View style={styles.contents}>
        <Image
          source={require("../assets/arr_lert.png")}
          style={styles.icon}
          onAnimatedValueUpdate={() => {}}
        />
        <Image
          source={require("../assets/girl3.gif")}
          style={styles.character}
        />
        <Image
          source={require("../assets/arr_right.png")}
          style={styles.icon}
          onAnimatedValueUpdate={() => {}}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#F4F4F4",
  },
  bar: {
    flex: 0,
    height: 50,
    padding: 10,
    alignItems: "left",
  },
  contents: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  character: {
    flex: 1,
    resizeMode: "contain", // 修正: 縦横比を保持しながら親要素に収まるように
  },
  icon: {
    width: 25,
    height: 25,
  },
});

export default HomeScreen;
