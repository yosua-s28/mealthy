import React, { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { createStackNavigator } from "@react-navigation/stack";
import ScannerPage from '../components/ScannerPage';
import ResultPage from '../components/ResultPage';

const Stack = createStackNavigator();

const Scanner = ({ navigation }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'PlusJakartaSans-Regular': require('../assets/PlusJakartaSans-Regular.ttf'),
      'PlusJakartaSans-Bold': require('../assets/PlusJakartaSans-Bold.ttf'),
      'PlusJakartaSans-Medium': require('../assets/PlusJakartaSans-Medium.ttf'),
    });
    setFontsLoaded(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="Scanner" component={ScannerPage} options={{headerShown: false}}/>
      <Stack.Screen name="Result" component={ResultPage} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
};

export default Scanner;
