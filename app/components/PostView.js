import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Share, Modal, TextInput } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // Import the icons
import CommentBox from "./CommentBox";
import { useNavigation } from '@react-navigation/native';


export default function PostView({ post }) {
    // Static user data (replace with actual user data in a real app)
    const username = "Mie";
    const userHandle = "@bakmielovers";
    const profileImage = null; // You might want to show a default icon if there is no profile picture.
    const [isLiked, setIsLiked] = useState(false);
    const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
    const [comments, setComments] = useState([]);
    const [hasComment, setHasComment] = useState(false);
    const navigation = useNavigation();
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
     const [reportReason, setReportReason] = useState('');


    const handleCommentPress = () => {
        setIsCommentBoxOpen(!isCommentBoxOpen);
    };
    const handleLikePress = () => {
        setIsLiked(!isLiked);
    };
    const handleSharePress = async () => {
         try {
              const result = await Share.share({
                  message: `Check out this post: ${post.text}`,
              });
             if (result.action === Share.sharedAction) {
               if (result.activityType) {
                   console.log("Shared with activity type:", result.activityType);
               } else {
                 console.log("Shared!");
               }
            } else if (result.action === Share.dismissedAction) {
                 console.log("Share dismissed!");
             }
            } catch (error) {
                console.log("Share Error:", error);
                Alert.alert("Share Error", "Could not share this post");
            }
    };
    const handleReportPress = () => {
        setIsReportModalVisible(true)
    };
    const handleCancelReport = () => {
       setIsReportModalVisible(false);
       setReportReason('');
    };
   const handlePostReport = () => {
         if (reportReason.trim() === '') {
              Alert.alert("Report Error", "Please provide a reason for reporting");
              return;
          }
        console.log("Reported with reason:", reportReason);
       Alert.alert("Report Sent", "Thank you for the report, we will review it soon.")
        setIsReportModalVisible(false);
        setReportReason('');
    };
     const handlePostComment = (commentText) => {
        setComments([...comments, {
            id: new Date().getTime(),
            user: 'Kua',
            userHandle: '@miekuah',
            comment: commentText,
        }]);
        setIsCommentBoxOpen(false);
         setHasComment(true);
    };
    const handleCancelComment = () => {
         setIsCommentBoxOpen(false);
    }
     const handleRecipePress = () => {
        if (post.recipe) {
            navigation.navigate('Recipe Detail', { recipe: post.recipe });
        }
    };
    const handleImagePress = (imageUrl) => {
        navigation.navigate('Image Viewer', { imageUrl });
    };


    return (
        <View style={styles.postContainer}>
            {/* User Info */}
            <View style={styles.userInfo}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <Ionicons name="person-circle-outline" size={24} color="#000" />
                )}
                <View style={styles.usernameHandleContainer}>
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.userHandle}>
                        {userHandle} · just now
                    </Text>
                </View>
            </View>


            {/* Post Content Container */}
            <View style={styles.postContentContainer}>
                <View style={styles.postContent}>
                    {/* Post Text */}
                    <Text style={styles.text}>{post.text}</Text>


                    {/* Post Images */}
                    {post.images && (
                        <View style={styles.imageContainer}>
                            {post.images.map((image, index) => (
                              <TouchableOpacity onPress={() => handleImagePress(image)} key={index}>
                                  <Image  source={{ uri: image }} style={styles.postImage} />
                              </TouchableOpacity>
                            ))}
                        </View>
                    )}


                    {/* Recipe Details */}
                    {post.recipe && (
                        <TouchableOpacity onPress={handleRecipePress}>
                             <View style={styles.recipeContainer}>
                                {post.recipe.image && (
                                    <Image source={{ uri: post.recipe.image }} style={styles.recipeImage} />
                                 )}
                                <Text style={styles.recipeTitle}>{post.recipe.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>


            {/* Interaction Icons */}
            <View style={styles.iconBar}>
                <TouchableOpacity style={styles.iconButton} onPress={handleCommentPress}>
                    <Ionicons name="chatbubble-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleLikePress}>
                    <Ionicons name={isLiked ? "heart" : "heart-outline"} size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleSharePress}>
                    <Ionicons name="share-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleReportPress}>
                    <Ionicons name="information-circle-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>


           {/* Conditionally Render Separator Line */}
           {(isCommentBoxOpen || hasComment) && <View style={styles.separator} />}


            {/* Show CommentBox if comment button is pressed */}
            {isCommentBoxOpen && (
                <View style={{ marginTop: 10}}>
                     <CommentBox onPostComment={handlePostComment} onCancel={handleCancelComment}/>
                 </View>
            )}
             {/* Another User Info section below the post*/}
            {hasComment && (
                 <View style={styles.commentSectionContainer}>
                     {comments.map((comment) => (
                        <View key={comment.id} style={styles.commentContainer}>
                            <View style={styles.userInfo}>
                                <Ionicons name="person-circle-outline" size={24} color="#000" />
                                <View style={styles.usernameHandleContainer}>
                                    <Text style={styles.username}>{comment.user}</Text>
                                    <Text style={styles.userHandle}>
                                        {comment.userHandle}
                                    </Text>
                                </View>
                            </View>
                             <Text style={[styles.text, {marginLeft: 35}]}>{comment.comment}</Text>
                        </View>
                     ))}
                </View>
            )}
            {/* Report Modal */}
             <Modal
                animationType="slide"
                transparent={true}
                visible={isReportModalVisible}
                onRequestClose={handleCancelReport}
               >
                 <View style={styles.reportModalContainer}>
                    <View style={styles.reportModalContent}>
                     <Text style={styles.reportModalTitle}>Report Post</Text>
                     <TextInput
                        style={styles.reportTextInput}
                        placeholder="Enter report reason..."
                         multiline
                        value={reportReason}
                         onChangeText={setReportReason}
                     />
                   <View style={styles.reportButtonContainer}>
                         <TouchableOpacity style={styles.cancelButton} onPress={handleCancelReport}>
                               <Text style={styles.cancelButtonText}>Cancel</Text>
                           </TouchableOpacity>
                           <TouchableOpacity style={styles.postButton} onPress={handlePostReport}>
                             <Text style={styles.postButtonText}>Report</Text>
                           </TouchableOpacity>
                       </View>
                  </View>
               </View>
            </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
      commentSectionContainer: {
         marginLeft: 35
      },
       commentContainer: {
            paddingTop: 5,
            paddingBottom: 5,
      },
    postContainer: {
        marginBottom: 15,
        borderBottomWidth: 0,
        paddingBottom: 15,
        backgroundColor: '#BFC693',
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        marginHorizontal: 5,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 5,
    },
    usernameHandleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    username: {
        fontWeight: "bold",
        fontSize: 16,
        color: '#333',
        marginRight: 5,
    },
    userHandle: {
        fontSize: 12,
        color: "gray"
    },
    profileImage: {
        width: 30,
        height: 30,
        borderRadius: 15
    },
     postContentContainer: {
        flexDirection: 'row', // Added to align content horizontally
        marginLeft: 35
    },
    postContent: {
         flex: 1,
         marginBottom: 10,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
    },
    recipeContainer: {
        marginTop: 5,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFBE2",
        borderRadius: 8,
        padding: 8,
    },
    recipeTitle: {
        fontWeight: "bold",
        fontSize: 16,
        color: '#333',
    },
    recipeImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginTop: 5,
        marginRight: 10,
    },
    postImage: {
        width: 100,
        height: 100,
        borderRadius: 5,
        marginRight: 5
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    iconBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
        paddingHorizontal: 10,
        marginLeft: 20,
    },
    iconButton: {
       marginHorizontal: 10,
       flex: 1,
    },
     separator: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginVertical: 0,
        marginLeft: 20,
        marginTop: 15,
        marginBottom: 10,
    },
     reportModalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
       backgroundColor: 'rgba(0,0,0,0.5)',
    },
    reportModalContent: {
      backgroundColor: '#fff',
         padding: 20,
        borderRadius: 10,
        width: '80%',
     },
     reportModalTitle: {
         fontSize: 20,
        fontWeight: "bold",
         marginBottom: 15,
         color: '#000'
     },
    reportTextInput: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        padding: 10,
         marginBottom: 15,
        textAlignVertical: 'top',
        minHeight: 80,
        color: '#000'
     },
     reportButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
   postButton: {
       backgroundColor: '#8d9a64',
       padding: 8,
        borderRadius: 15,
       marginLeft: 10,
       alignItems: 'center',
       justifyContent: 'center',
   },
   postButtonText: {
     color: '#fff',
      fontSize: 16,
    },
   cancelButton: {
        backgroundColor: '#ccc',
        padding: 8,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
   },
   cancelButtonText: {
       color: '#fff',
        fontSize: 16,
    },
});
