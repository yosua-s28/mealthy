import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


export default function ImageViewerScreen({ route }) {
    const { imageUrl } = route.params;
    const navigation = useNavigation();

    const handleClose = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close-circle-outline" size={32} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '80%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
});
