// AppContext.js
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 時刻を 0:00 に設定

  const [alarms, setAlarms] = useState([
    { time: new Date(today), isActive: false },
    { time: new Date(today), isActive: false },
    { time: new Date(today), isActive: false },
  ]);

  const [markedDates, setMarkedDates] = useState({});
  const [phrases, setPhrases] = useState([
    {
      id: 1,
      text: "おはようございます。今日も一緒に素敵な1日を迎えましょう。",
      achieved: true,
    },
    { id: 2, text: "おはよう。なんでそんなに笑ってるの？", achieved: false },
    {
      id: 3,
      text: "すごいね。今日も目覚ましを1回で止めてくれてありがとう。",
      achieved: false,
    },
    { id: 4, text: "今日も君の笑顔とっても素敵だね。", achieved: false },
    {
      id: 5,
      text: "君の笑顔は私の元気の源なんだよ。おはよう。",
      achieved: false,
    },
    {
      id: 6,
      text: "おはよう。今日の予定はもう考えてる？なにしようね。",
      achieved: false,
    },
    {
      id: 7,
      text: "小さな一歩も大事だよね。君ならきっとできるはず！",
      achieved: false,
    },
    {
      id: 8,
      text: "君の笑顔は今日もきっとみんなを笑顔にできます。",
      achieved: false,
    },
    {
      id: 9,
      text: "成功は小さな積み重ねから。今日も一歩進んでいこう。",
      achieved: false,
    },
    {
      id: 10,
      text: "おはよう！今日の天気確認した？お出かけの時は気を付けてね。",
      achieved: false,
    },
  ]);

  const contextValue = {
    alarms,
    setAlarms,
    markedDates,
    setMarkedDates,
    phrases,
    setPhrases,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
