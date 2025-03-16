import { StyleSheet } from "react-native";  

const styles = StyleSheet.create({
  containersafe:{
    flex:1,
    height:'100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  dateWrapper: {
    margin: 20,
  },
  label: {
    fontSize: 20,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'PlusJakartaSans-Bold'
  },
  dateContainer: {
    backgroundColor: '#FFF9DB',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
    color: '#555',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'PlusJakartaSans-Regular',
  },
  scrollContainer:{
    height:'100%'
  },
  pickerOverlay: {
    position: 'absolute',
    height:'100%',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Efek overlay semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Pastikan overlay muncul di atas elemen lain
  },

  pickerContainer: {
    backgroundColor: '#FFF',
    paddingBottom: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Efek shadow untuk Android
    width: '90%', // Ukuran picker agar tidak terlalu kecil
    alignItems: 'center',
  },
  mealSection: {
    marginBottom: 20,
  },
  mealTitle: {
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#333',
    marginBottom: 5,
    marginLeft: 20,
  },
  mealBox: {
    backgroundColor: '#FFF9DB',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  mealImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  mealTextContainer: {
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  mealDescription: {
    fontSize: 14,
    color: '#555',
  },
  emptyMealBox: {
    backgroundColor: '#FFF9DB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#000000',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    width: '90%',
  },
  emptyMealText: {
    fontSize: 16,
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
});

export default styles;