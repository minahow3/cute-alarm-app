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
      text: "おーい、朝だよ。そろそろ起きて!",
      achieved: true,
    },
    {
      id: 2,
      text: "おはよう！今日の天気確認した？お出かけの時は気を付けてね。",
      achieved: false,
    },
    {
      id: 3,
      text: "おっはよう～～。今日も1日がんばろうー！",
      achieved: false,
    },
    {
      id: 4,
      text: "おはよう！ふふ、すごい寝ぐせ。可愛いね。",
      achieved: false,
    },
    {
      id: 5,
      text: "おはーー！んん？寝ぼけてるの？わたしだよ。おはよう！",
      achieved: false,
    },
    {
      id: 6,
      text: "ねぇ……ねーえ。起きて。そろそろ起きてよ。おーきーてーよーー！！",
      achieved: false,
    },
    {
      id: 7,
      text: "おはよう。今日の予定はもう考えてる？なにしようね？",
      achieved: false,
    },
    {
      id: 8,
      text: "遅刻しちゃっていいの？ダメでしょ？！早く起きるの！",
      achieved: false,
    },
    {
      id: 9,
      text: "おはよう！起きて！あれ？寝てる？よしっ、こちょこちょタイムだ！",
      achieved: false,
    },
    {
      id: 10,
      text: "おーはーようっ！ねー起きてー？・・起きないとチューしちゃうぞっ！",
      achieved: false,
    },
  ]);

  const [bgmVolume, setBgmVolume] = useState(0.5);

  const contextValue = {
    alarms,
    setAlarms,
    markedDates,
    setMarkedDates,
    phrases,
    setPhrases,
    bgmVolume, // 追加
    setBgmVolume, // 追加
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
