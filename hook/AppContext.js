// AppContext.js
import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [alarms, setAlarms] = useState([
    { time: new Date(), isActive: false },
    { time: new Date(), isActive: false },
    { time: new Date(), isActive: false },
  ]);

  const contextValue = {
    alarms,
    setAlarms,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
