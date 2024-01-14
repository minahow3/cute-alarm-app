import * as React from "react";
import { View, Text, SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import AlarmScreen from "./screens/AlarmScreen";
import ConfigScreen from "./screens/ConfigScreen";

import BGMPlayer from "./hook/BGMPlayer";

import { AppProvider } from "./hook/AppContext.js";

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function TopTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          height: 60,
        },
      }}
    >
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Alarm" component={AlarmScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BGMPlayer />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="TopTab" component={TopTab} />
          <Stack.Screen name="Config" component={ConfigScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
