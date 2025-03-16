import React, { useState, useEffect, useContext } from 'react'; // Import useContext
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Modal,
  SafeAreaView, ActivityIndicator, FlatList, Alert
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

const MyProfileScreen = () => {
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
  const { userId, setUserId } = useContext(UserContext); // Access userId and setUserId from context

  // Function to load user profile
  const loadProfile = async () => {
    setLoading(true);
    try {
      console.log('Nilai userId dari UserContext:', userId);

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

  const handleEditProfile = () => {
    const formattedProfile = {
      ...profile,
      dob: profile.dob ? moment(profile.dob).format('YYYY-MM-DD') : '',
    };
    navigation.navigate('EditProfile', { profile: formattedProfile });
  };

  const renderMenuItem = ({ item, index }) => (
    <View key={index} style={styles.menuGroup}>
      <TouchableOpacity style={styles.menuItem} onPress={item.action}>
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
      action: () => {
        setUserId(null); // Clear user ID on logout
        AsyncStorage.removeItem('userId'); // Clear async storage
        navigation.navigate('Login');
      }
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
      <BottomNavigation navigation={navigation} activeRouteName="MyProfile" />

    </View>

    );
  }

  return (
      <View style={styles.container}>
        <SafeAreaView style={styles.containersafe}>

        <Header navigation={navigation} title="My Profile" />

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../assets/logo_#c0c78c.png')}  // Static image from assets
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>{profile.name || 'Unknown'}</Text>
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
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
    <BottomNavigation navigation={navigation} activeRouteName="MyProfile" />
    </View>

  );
};

export default MyProfileScreen;