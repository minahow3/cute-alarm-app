// useAsyncStorage.js
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAsyncStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  // useAsyncStorage.js
  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        console.log(`Key: ${key}, Retrieved value: ${value}`);
        if (value !== null) {
          setStoredValue(JSON.parse(value));
        } else {
          // 初回読み込み時に値がない場合、初期値を設定
          setStoredValue(initialValue);
          if (key === "markedDates") {
            // setStoredValue の更新が完了してから setItem を実行
            await AsyncStorage.setItem(key, JSON.stringify(initialValue));
          }
        }
      } catch (error) {
        console.error("Error retrieving data from AsyncStorage:", error);
      }
    };

    getData();
  }, [key]);

  const setValue = async (value) => {
    if (value !== null && value !== undefined) {
      try {
        setStoredValue(value);
        console.log(`Key: ${key}, Setting value: ${JSON.stringify(value)}`);
        if (JSON.stringify(value)) {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.error(
          "Error setting data to AsyncStorage for key",
          key,
          ":",
          error
        );
      }
    } else {
      console.warn(
        `Attempting to set null/undefined value to AsyncStorage for key: ${key}. Use .removeItem method instead.`
      );
    }
  };

  return [storedValue, setValue];
};

export default useAsyncStorage;
