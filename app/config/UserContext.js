import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [calorieData, setCalorieData] = useState({
    totalCalories: 0,
    totalFat: 0,
    totalProtein: 0,
    entries: [],
  });

  return (
    <UserContext.Provider value={{ userId, setUserId, calorieData, setCalorieData }}>
      {children}
    </UserContext.Provider>
  );
};
