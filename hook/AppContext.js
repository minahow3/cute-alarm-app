// AppContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import useAsyncStorage from "./useAsyncStorage";

// ヘルパー関数: 文字列から日付オブジェクトへの変換
export const convertStringToDate = (timeString) => {
  return new Date(timeString);
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 時刻を 0:00 に設定

  // alarmsの初期値をAsyncStorageから取得する
  const [alarms, setAlarms] = useAsyncStorage("alarms", [
    { time: new Date(today), isActive: false },
    { time: new Date(today), isActive: false },
    { time: new Date(today), isActive: false },
  ]);
  // const [alarms, setAlarms] = useState([
  //   { time: new Date(today), isActive: false },
  //   { time: new Date(today), isActive: false },
  //   { time: new Date(today), isActive: false },
  // ]);

  // markedDatesの初期値をAsyncStorageから取得する
  const [markedDates, setMarkedDates] = useAsyncStorage("markedDates", {
    "1999-12-01": { marked: true, selected: true, dotColor: "#facfde" },
  });

  // const [markedDates, setMarkedDates] = useState({
  //   // "2023-12-01": { marked: true, selected: true, dotColor: "green" },
  // });

  // phrasesの初期値をLocalStorageから取得する
  const [phrases, setPhrases] = useAsyncStorage("phrases", [
    // デフォルトのフレーズデータ
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
    // {
    //   id: 10,
    //   text: "おーはーようっ！ねー起きてー？・・起きないとチューしちゃうぞっ！",
    //   achieved: false,
    // },
  ]);
  // const [phrases, setPhrases] = useState([
  //   {
  //     id: 1,
  //     text: "おーい、朝だよ。そろそろ起きて!",
  //     achieved: true,
  //   },
  //   {
  //     id: 2,
  //     text: "おはよう！今日の天気確認した？お出かけの時は気を付けてね。",
  //     achieved: false,
  //   },
  //   {
  //     id: 3,
  //     text: "おっはよう～～。今日も1日がんばろうー！",
  //     achieved: false,
  //   },
  //   {
  //     id: 4,
  //     text: "おはよう！ふふ、すごい寝ぐせ。可愛いね。",
  //     achieved: false,
  //   },
  //   {
  //     id: 5,
  //     text: "おはーー！んん？寝ぼけてるの？わたしだよ。おはよう！",
  //     achieved: false,
  //   },
  //   {
  //     id: 6,
  //     text: "ねぇ……ねーえ。起きて。そろそろ起きてよ。おーきーてーよーー！！",
  //     achieved: false,
  //   },
  //   {
  //     id: 7,
  //     text: "おはよう。今日の予定はもう考えてる？なにしようね？",
  //     achieved: false,
  //   },
  //   {
  //     id: 8,
  //     text: "遅刻しちゃっていいの？ダメでしょ？！早く起きるの！",
  //     achieved: false,
  //   },
  //   {
  //     id: 9,
  //     text: "おはよう！起きて！あれ？寝てる？よしっ、こちょこちょタイムだ！",
  //     achieved: false,
  //   },
  //   // {
  //   //   id: 10,
  //   //   text: "おーはーようっ！ねー起きてー？・・起きないとチューしちゃうぞっ！",
  //   //   achieved: false,
  //   // },
  // ]);

  // bgmVolumeの初期値をAsyncStorageから取得する
  const [bgmVolume, setBgmVolume] = useAsyncStorage("bgmVolume", 0.5);
  // const [bgmVolume, setBgmVolume] = useState(0.5);

  const contextValue = {
    alarms,
    setAlarms,
    markedDates,
    setMarkedDates,
    phrases,
    setPhrases,
    bgmVolume: bgmVolume !== undefined ? bgmVolume : 0.5, // 初回読み込み時のundefinedを防ぐ
    setBgmVolume, // 追加
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
