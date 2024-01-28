import * as React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import AlarmScreen from "./screens/AlarmScreen";
import ConfigScreen from "./screens/ConfigScreen";

import BGMPlayer from "./hook/BGMPlayer";

import { AppProvider } from "./hook/AppContext.js";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TopTab() {
  // アイコンに枠を付けるスタイル
  const iconStyle = {
    padding: 0,
    // borderWidth: 1, // 枠の幅
    // borderColor: "black", // 枠の色
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarPosition="bottom"
        swipeEnabled={true}
        tabBarOptions={{
          style: {
            height: 60, // タブバーの高さを変更
          },
          showLabel: false, // タブのテキストを非表示にする
        }}
        tabBarScrollEnabled={true}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "History") {
              iconName = "history";
            } else if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Alarm") {
              iconName = "alarm";
            }

            // ここで icon を表示します
            return (
              <MaterialIcons
                name={iconName}
                size={26}
                color={color}
                style={iconStyle}
              />
            );
          },
          tabBarLabel: "", // タブのテキストを非表示にする
        })}
      >
        <Tab.Screen
          name="History"
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Alarm"
          component={AlarmScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function App() {
  return (
    <AppProvider>
      <BGMPlayer />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, presentation: "modal" }}
        >
          <Stack.Screen name="TopTab" component={TopTab} />
          <Stack.Screen name="Config" component={ConfigScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
