import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    flex: 1,
    backgroundColor: '#F9F6F6',
  },
  searchAndFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBE2',
    height: 40,
    flex: 1,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  searchInput: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    backgroundColor: '#FFFBE2',
    paddingLeft: 30,
    flex: 1,
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
  filterList: {
    marginTop: 10,
    marginBottom: 20,
  },
  filterItem: {
    backgroundColor: '#A6B37D',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
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
    margin: 15,
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
    marginLeft: 15,
    marginTop: 10,
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
    marginLeft: 10,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'PlusJakartaSans-Bold',
    marginLeft: 10,
    marginBottom: 8,
  },
  recipeItem: {
    marginLeft: 8,
    marginRight: 12,
    width: 150,
    backgroundColor: '#FFFBE2',
    borderRadius: 8,
    flexDirection: 'column',
  },
  recipeImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  recipeTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
    marginTop: 8,
    marginLeft: 5,
  },
  recipeFooter: {
    marginTop: 'auto',
  },
  recipeDetails: {
    color: '#888',
    fontFamily: 'PlusJakartaSans-Regular',
    paddingBottom: 10,
    marginLeft: 5,
  },
  backButton: {
    marginRight: 10,
  },
});

export default styles;