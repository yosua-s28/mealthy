import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { RNCamera } from 'react-native-camera';
import { PermissionsAndroid, Platform } from 'react-native';

const ScannerPage = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera to scan ingredients.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        setHasPermission(true);
      }
      setIsLoading(false);
    })();
  }, []);

  const scanImage = async () => {
    console.log('Scanning image...');
    
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconContainer}>
          <Ionicons name="arrow-back" style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>ALLERGY SCANNER</Text>
      </View>

      <View style={styles.contentArea}>
        {/* scanner */}
        <View style={styles.scannerArea}>
          <RNCamera
            style={styles.scanner}
            ref={cameraRef}
          />

          <View style={styles.scanText}>
            <Text style={styles.scanText1}>SCAN THE INGREDIENTS</Text>
            <Text style={styles.scanText2}>to get your allergen alert</Text>
          </View>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={scanImage}
          >
            <Ionicons name="scan" style={styles.scanIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: '11%',
    backgroundColor: '#F9F6F6',
    alignItems: 'center',
  },

  headerContainer: {
    width: '100%',
    height: 65,
    backgroundColor: '#c0c78c',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    elevation: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
  
  iconContainer: {
    width: 'auto',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 15,
  },
  
  icon: {
    fontSize: 20,
  },
  
  headerText: {
    fontSize: 18,
    // fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Bold',
  },

  contentArea: {
    backgroundColor: '#F9F6F6',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scannerArea: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    backgroundColor: '#D9D9D9',
    width: '90%',
    height: '85%',
    borderRadius: 20,
    bottom: 90,
  },

  scanner: {
    flex: 1,
  },

  scanText: {
    position: 'absolute',
    top: 25,
    width: '85%',
    alignItems: 'flex-start',
  },

  scanText1: {
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'PlusJakartaSans-Bold',
  },
  
  scanText2: {
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Regular',
  },
  
  captureButton: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 100,
    padding: 10,
    backgroundColor: '#c0c78c',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 25,
  },

  scanIcon: {
    fontSize: 25,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ScannerPage;