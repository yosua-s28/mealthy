import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  
  container: { 
    top: 25,
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 20,
    zIndex: 1,
  },
  image: { 
    width: "100%",
    height: 356,
  },
  title: {
    fontSize: 22,
    marginVertical: 10,
    marginHorizontal: 10,
    fontFamily: "PlusJakartaSans-Bold",
    textAlign: "center", // Center the title
  },
  
  iconsContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingBottom: 10,
    alignSelf: 'center',
  },
  
  author: { 
    marginHorizontal: 10,
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
    textAlign: "left", // Center align the author
    marginBottom: 15,
  },

  borderLine: {
    borderBottomWidth: 1, 
    borderBottomColor: '#000000', 
    marginHorizontal: 0,
    marginVertical: 5,
    borderRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,  
      height: 1, 
    },
    shadowOpacity: 1,
    shadowRadius: 1, 
  },
  infoContainer: { 
    flexDirection: "row", 
    marginVertical: 10,
    marginHorizontal: 10,
    marginTop: 15,
    marginBottom: 20,
  },
  eta: {
    fontFamily: "PlusJakartaSans-Regular",
    marginRight: 10,
  },
  calorie: {
    fontFamily: "PlusJakartaSans-Regular",
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  circleContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    position: 'absolute',
    top: '30%',
    fontSize: 18,
    fontWeight: 'bold',
  },
  labelText: {
    marginTop: 8,
    fontSize: 16,
  },
  sectionTitle: { 
    fontSize: 24, 
    marginVertical: 10,
    fontFamily: "PlusJakartaSans-Bold",
    marginLeft: 10,
  },
  ingredientsContainer: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
  },
  ingredient: {
    fontFamily: "PlusJakartaSans-Regular",
    paddingLeft: 10,
  },
  instructionsContainer: {
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  instructionText: {
    fontFamily: "PlusJakartaSans-Regular",
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
    paddingLeft: 10,
    paddingRight: 10,
  },
  notificationPopup: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  notificationText: {
    color: "white",
    fontSize: 16,
    fontFamily: "PlusJakartaSans-Regular",
  },
  scrollContainer: {
    paddingBottom: 60,  
  },
});

export default styles;