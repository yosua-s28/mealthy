import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containersafe: {
    flex: 1,
    height: '90%',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9F6F6',
  },
  filterList: {
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 10,
    flexDirection: 'row',
    width: '95%',
  },
  searchAndFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '95%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE2',
    height: 35,
    flex: 1,
    borderRadius: 8,
    alignSelf: 'center',
    paddingHorizontal: 0,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: '#000',
    marginLeft: 15,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginLeft: 15,
    alignSelf: 'center',
  },
  filterButton: {
    paddingLeft: 15,
    alignItems: 'center',
    flex: 0.1,
  },
  filterIcon: {
    fontSize: 18,
    color: '#B99470',
    marginRight: 10,
  },
  filterItem: {
    backgroundColor: '#A6B37D',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  filterItemSelected: {
    backgroundColor: '#8aa683',
  },
  filterText: {
    fontFamily: 'PlusJakartaSans-Regular',
    fontSize: 14,
    color: '#4a4a4a',
  },
  filterTextSelected: {
    color: '#fff',
  },
  trendingItem: {
    marginRight: 10,
    marginTop: 0,
    marginBottom: 15,
  },
  trendingImage: {
    width: 263,
    height: 141,
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 10,
  },
  trendingText: {
    fontFamily: 'PlusJakartaSans-Bold',
    color: 'white',
    fontSize: 16,
    overflow: 'hidden',
  },
  trendingTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    marginLeft: 4,
    marginTop: 10,
  },
  trendinglist: {
    alignSelf: 'center',
    width: '95%',
  },
  trend1: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 80,
    borderRadius: 8,
    borderTopLeftRadius: 0,
  },
  trend2: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginRight: 102,
    borderRadius: 10,
    borderTopLeftRadius: 0,
  },
  section: {
    width: '95%',
    marginLeft: 10,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    marginLeft: 4,
    marginBottom: 8,
  },
  recipeItem: {
    marginRight: 10,
    width: 165,
    backgroundColor: '#FFFBE2',
    borderRadius: 8,
    flexDirection: 'column',
  },
  recipeImage: {
    width: 165,
    height: 165,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  recipeTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    marginTop: 8,
    minHeight: 70,
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 5,
  },
  
  recipeFooter: {
    marginTop: 'auto',
    alignSelf: 'center',
    alignContent: 'center',
    width: '100%',
  },
  recipeDetails: {
    color: '#888',
    fontFamily: 'PlusJakartaSans-Regular',
    paddingBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    marginRight: 10,
  },
  newInsightButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
  },
  imageContainer: {
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFFBE2',
    borderRadius: 25,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#567100',
    padding: 10,
    width: '100%',
    textAlign: 'center'
  },
  description: {
    fontSize: 20,
    color: '#567100',
    textAlign: 'center',
    marginVertical: 15,
    fontFamily: 'PlusJakartaSans-VariableFont_wght',
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  list: {
    marginBottom: 15,
  },
  listItem: {
    fontSize: 16,
    color: '#555555',
    marginVertical: 5,
    fontFamily: 'PlusJakartaSans-Regular',
    textAlign: 'justify',
    paddingHorizontal: 30
  },
  tip: {
    fontSize: 16,
    color: '#FF6347',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Regular',
    marginTop: 10,
  },
  titlepopup: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',   
    backgroundColor: '#A6B37D',
    padding: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  closeModalButton: {
    backgroundColor: '#FF6347', // Red close button
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    position: 'absolute',
    right: 15, 
  },
  closeModalText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },

});

export default styles;
