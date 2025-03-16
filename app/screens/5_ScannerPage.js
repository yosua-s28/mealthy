import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Button, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { CameraView, useCameraPermissions } from "expo-camera";
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';

const ScannerPage = ({ navigation }) => {
  const [cameraRef, setCameraRef] = useState(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState(null);

    if (!permission) {
        return <Text>Permission Doesn't Exist</Text>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const takePicture = async () => {
        if (!cameraRef) {
            console.log("Camera Not Found");
        } else {
            const photo = await cameraRef.takePictureAsync({ base64: true });
            // console.log(photo);
            setPhotoUri(photo?.uri);
            navigation.navigate('Result', { photoUri: photo?.uri });
        }
    };

  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.containersafe}>
        {/* header */}
        <Header navigation={navigation} title="Allergy Scanner" />

        <View style={styles.contentArea}>
            {/* scanner */}
            <View style={styles.scannerArea}>
            <CameraView
                style={styles.scanner}
                onCameraReady={() => console.log("Camera Ready")}
                ref={(ref) => setCameraRef(ref)}
            >
                {/* <View> */}
                <View style={styles.scanText}>
                    <Text style={styles.scanText1}>SCAN THE INGREDIENTS</Text>
                    <Text style={styles.scanText2}>to get your allergen alert</Text>
                </View>
                    <Image
                        style={styles.imagePreview}
                        source={{ uri: photoUri }}
                    />
                    <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                        >
                        <Ionicons name="scan" style={styles.scanIcon} />
                    </TouchableOpacity>
                    </View>
                {/* </View>  */}
            </CameraView>
            </View>
        </View>

        <StatusBar style="auto" />
        </SafeAreaView>
        <BottomNavigation navigation={navigation} activeRouteName="Scanner" />
    </View>
  );
}

const styles = StyleSheet.create({
  containersafe:{
    flex:1,
    height:'100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
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
    height: '86%',
    borderRadius: 25,
    bottom: 77,
  },

  scanner: {
    flex: 1,
    width: '100%',
    borderRadius: 20,
  },

  scanText: {
    position: 'absolute',
    top: 20,
    width: '85%',
    alignItems: 'flex-start',
    paddingLeft: 20,
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

  imagePreview: {
    width: '100%',
    height: '100%',
  },

  button: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default ScannerPage;