import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
    Alert
} from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function AddPostBox({ onAddRecipe, onAddEmoji, onPost, isEmojiPickerVisible, emojis, handleEmojiSelect, handleCloseEmojiPicker}) {
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [isImageButtonDisabled, setIsImageButtonDisabled] = useState(false);

    useEffect(() => {
        (async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need gallery access to select images.');
          }
        })();
    }, []);
    
    // Handle adding image from gallery
    const pickImageFromGallery = async () => {
        if (images.length >= 4) {
            Alert.alert('Limit Reached', 'You can only add up to 4 images.');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const selectedImages = result.assets.map(asset => asset.uri);
            if (images.length + selectedImages.length > 4) {
                Alert.alert('Limit Exceeded', 'You can only upload up to 4 images.');
                return;
            }
            setImages(prevImages => [...prevImages, ...selectedImages]);
            if (images.length + selectedImages.length >= 4) {
                setIsImageButtonDisabled(true);
            }
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
        if (updatedImages.length < 4) {
            setIsImageButtonDisabled(false);
        }
    };

    const handleRemoveRecipe = () => {
        setRecipe(null);
    };

    const handlePostPress = () => {
        onPost({ text, images, recipe });
        setText('');
        setImages([]);
        setIsImageButtonDisabled(false);
        setRecipe(null);
    };
    
    const handleAddRecipePress = () => {
        onAddRecipe(setRecipe);
    };

    const isPostButtonDisabled = useMemo(() => {
        return !text.trim() && images.length === 0 && !recipe;
    }, [text, images, recipe]);

    return (
        <View style={[styles.container, isEmojiPickerVisible && styles.emojiPickerActive]}>
            {/* Input Container */}
            <View style={styles.inputContainer}>
                <Ionicons name="person-circle-outline" size={27} color="black" />
                <TextInput
                    style={styles.input}
                    placeholder="Add post...."
                    value={text}
                    onChangeText={setText}
                    multiline
                    textAlignVertical="top"
                    placeholderTextColor="#888"
                />
            </View>

            {/* Recipe Container */}
            {recipe && (
                <View style={styles.recipeContainer}>
                    {recipe.image && (
                        <Image source={{uri: recipe.image}} style={styles.recipeImage} />
                    )}
                    <TouchableOpacity style={styles.recipeContent} onPress={handleAddRecipePress}>
                        <Text style={styles.recipeText}>{recipe.title}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleRemoveRecipe} style={styles.removeRecipeIcon}>
                        <FontAwesome name="times-circle" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Image Preview */}
            <ScrollView horizontal style={styles.imageContainer}>
                {images.map((image, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri: image }} style={styles.image} />
                        <TouchableOpacity style={styles.removeIcon} onPress={() => handleRemoveImage(index)}>
                            <FontAwesome name="times-circle" size={20} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {isEmojiPickerVisible && (
                <View style={styles.emojiListContainer}>
                        {emojis.map((emoji, index) => (
                            <TouchableOpacity key={index} style={styles.emojiButton} onPress={() => handleEmojiSelect(emoji)}>
                                <Text style={styles.emojiText}>{emoji}</Text>
                            </TouchableOpacity>
                        ))}
                    <TouchableOpacity style={styles.emojiCloseButton} onPress={handleCloseEmojiPicker}>
                        <FontAwesome name="close" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
            )}


            {/* Buttons */}
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={handleAddRecipePress}>
                    <FontAwesome name="cutlery" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImageFromGallery} disabled={isImageButtonDisabled} style={{opacity: isImageButtonDisabled ? 0.5 : 1}}>
                    <FontAwesome name="image" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAddEmoji(setText)}>
                    <FontAwesome name="smile-o" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.postButton, isPostButtonDisabled && styles.disabledPostButton]} onPress={handlePostPress} disabled={isPostButtonDisabled}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#BFC693',
        padding: 10,
        width: '98%',
        alignSelf: 'center',
        borderRadius: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        textAlignVertical: 'top',
    },
    emojiPickerActive: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    emojiListContainer: {
        marginLeft: 13,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 10,
        paddingBottom: 10
    },
     emojiButton: {
        paddingHorizontal: 8,
        paddingVertical: 8,
        minWidth: 40,
    },
     emojiText: {
        fontSize: 25,
        textAlign: 'center',
    },
    emojiCloseButton: {
        justifyContent: 'center',
        alignItems:'center',
        marginLeft: 15,
    },

    imageContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        marginLeft: 35,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginBottom: 10,
        marginRight: 10,
    },
    removeIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 11,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
        marginLeft: 14,
    },
    postButton: {
        backgroundColor: '#425700',
        paddingHorizontal: 15,
        paddingVertical: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    disabledPostButton: {
        backgroundColor: '#999',
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
