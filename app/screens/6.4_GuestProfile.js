import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Modal,
  SafeAreaView, ActivityIndicator, FlatList, Alert, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useFonts } from 'expo-font';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { NGROK_URL } from "@env";
import { UserContext } from '../config/UserContext'; // Import UserContext
import styles from '../styles/6_MyProfileStyles'

const GuestProfile = () => {
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Regular.ttf'),
    'PlusJakartaSans-Medium': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Medium.ttf'),
    'PlusJakartaSans-Bold': require('../assets/fonts/Plus_Jakarta_Sans/static/PlusJakartaSans-Bold.ttf'),
  });
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  const { setUserId } = useContext(UserContext); // Access setUserId from context

  const userId = 0;  // Set userId to 0 explicitly

  // Function to load user profile
  const loadProfile = async () => {
    setLoading(true);
    try {
      console.log('Nilai userId dari GuestProfile:', userId);

      const response = await fetch(`${NGROK_URL}/users/${userId}`);

      if (!response.ok) {
        console.error('Gagal mengambil data profil. Status:', response.status);
        const errorText = await response.text();
        console.error('Respon error:', errorText);
        Alert.alert('Error', `Gagal memuat data profil. Status: ${response.status}. ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log("Data profil:", data);
      setProfile(data);
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
      Alert.alert('Error', 'Terjadi kesalahan saat memuat data profil.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) { // Ensure to load only when focused
      loadProfile();
    }
  }, [isFocused, userId]); // Add userId to dependency array

  const handleRegister = () => {
    const formattedProfile = {
      ...profile,
      dob: profile.dob ? moment(profile.dob).format('YYYY-MM-DD') : '',
    };
    navigation.navigate('RegisterPage', { profile: formattedProfile });
  };

  const handleLogout = async () => {
    try {
      // Clear user ID from context
      setUserId(null);
      // Clear userId from AsyncStorage
      await AsyncStorage.removeItem('userId');
      // Navigate to Login page
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Failed', 'An error occurred during logout.');
    }
  };

  const renderMenuItem = ({ item, index }) => (
    <View key={index} style={styles.menuGroup}>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
          if (item.title === "Log Out") {
            handleLogout(); // Call handleLogout for Log Out button
          } else if (userId === 0) {
            Alert.alert(
              'Registration Required',
              'You need to register to access this feature.',
              [
                {
                  text: 'Go to Register',
                  onPress: () => navigation.navigate('RegisterPage'), // Navigate to Register page
                },
                {
                  text: 'Ok',
                  onPress: () => {}, // Simply return to the current page
                },
              ]
            );
          } else {
            item.action();
          }
        }}
      >
        <View style={styles.menuItemLeft}>
          <Icon name={item.icon} size={24} color={item.color || "#000"} style={styles.menuIcon} />
          <Text style={[styles.menuText, item.color && { color: item.color }]}>{item.title}</Text>
        </View>
        <Icon name="chevron-right" size={24} color={item.color || "#000"} />
      </TouchableOpacity>
      <View style={styles.menuDivider} />
    </View>
  );

  const menuItems = [
    {
      title: "My Favorites",
      icon: "bookmark-outline",
      action: () => navigation.navigate('Bookmark')
    },
    {
      title: "My Meal Planners",
      icon: "calendar",
      action: () => navigation.navigate('MealPlanner')
    },
    {
      title: "Log Out",
      icon: "logout",
      color: "#C0392B",
      // action is now handled directly in renderMenuItem
    }
  ];

  if (loading) {
    return (
    <View style={styles.container}>
        <SafeAreaView style={styles.containersafe}>
          <Header navigation={navigation} title="My Profile" />
          <ActivityIndicator size="large" color="#0000ff" />
        <BottomNavigation navigation={navigation} activeRouteName="MyProfile" />
      </SafeAreaView>
    </View>

    );
  }

  if (!profile) {
    return (
    <View style={styles.container}>

      <SafeAreaView style={styles.containersafe}>
          <Header navigation={navigation} title="My Profile" />
          <Text>Gagal memuat data profil.</Text>
      </SafeAreaView>
      <BottomNavigation navigation={navigation} activeRouteName="GuestProfile" />

    </View>

    );
  }

  return (
      <View style={styles.container}>
        <SafeAreaView style={styles.containersafe}>

        <Header navigation={navigation} title="MY PROFILE" />

        <View style={styles.profileSection}>
            <Icon name="account-circle" size={200} color='gray' />
            <Text style={styles.name}>{profile.name || 'Unknown'}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleRegister}>
                <Text style={styles.editButtonText}>Register</Text>
            </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={30} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.fullImageContainer}>
              <Image
                source={profile.profileImage ? { uri: `${NGROK_URL}/images/${profile.profileImage}` } : require('../assets/breakfast-1.jpeg')}
                style={styles.fullImage}
              />
            </View>
          </View>
        </Modal>

        <View style={styles.menuSection}>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
    </SafeAreaView>
    <BottomNavigation navigation={navigation} activeRouteName="GuestProfile" />
    </View>

  );
};

export default GuestProfile;