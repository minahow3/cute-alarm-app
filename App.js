import "react-native-gesture-handler";
import React, { useEffect, useRef } from "react";
import { SafeAreaView, StyleSheet, Animated, LogBox } from "react-native";
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

LogBox.ignoreAllLogs();

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TopTab() {
  const routes = {
    History: "History", // 実際のルート名に置き換えてください
    Home: "Home",
    Alarm: "Alarm",
  };

  const iconStyle = {
    padding: 0,
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        initialRouteName={routes.Home}
        tabBarPosition="bottom"
        tabBarScrollEnabled={true}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;

            if (route.name === "History") {
              iconName = "history";
            } else if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Alarm") {
              iconName = "alarm";
            }

            return (
              <MaterialIcons
                name={iconName}
                size={26}
                color={color}
                style={iconStyle}
              />
            );
          },
          tabBarLabel: "",
          swipeEnabled: true,
          animationEnabled: false,

          style: {
            height: 60,
          },
          showLabel: false,
        })}
      >
        <Tab.Screen
          name={routes.History}
          component={HistoryScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name={routes.Home}
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name={routes.Alarm}
          component={AlarmScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  iconStyle: {
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
