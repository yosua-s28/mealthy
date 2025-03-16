import { StatusBar } from 'expo-status-bar';
import { Text, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/0_LoadingStyles';

export default function LoadingPage() {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000);
  }, []);

  return (
    <LinearGradient
      colors={['#fefae0', '#f0f6c2', '#c0c78d', '#a6b37d', '#869161']}
      style={styles.container}
    >
      <SafeAreaView style={styles.content}>
        <Text style={styles.name}>MEALTHY</Text>
        <Image
          source={require('../assets/logo_loading.png')}
          style={styles.logo}
        />
        <Text style={styles.slogan}>Keep It Healthy</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    </LinearGradient>
  );
}


