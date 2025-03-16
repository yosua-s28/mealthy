import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containersafe:{
    flex:1,
    height:'100%',
  },
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  profileSection: {
    flex: 1, // Take up full height of the screen
    justifyContent: 'center', // Vertically center the content
    alignItems: 'center', // Horizontally center the content
    paddingVertical: 20, // Add padding if necessary
  },
  name: {
    fontSize: 24,
    marginTop: 5,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#C39C7F',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
  profileImageContainer: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    borderWidth: 4,
    borderColor: '#AAB07F',
    overflow: 'hidden', 
    marginBottom: 20,
  },
  profileImage: {
    width: '100%', 
    height: '100%',
    resizeMode: 'cover', 
  },
  menuSection: { marginTop: 10, paddingVertical: 10 },
  menuGroup: { marginBottom: 40 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuItemLeft: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: { 
    marginRight: 20,
  },
  menuText: { fontSize: 18, color: '#000' },
  menuDivider: { height: 2, backgroundColor: '#AAB07F', marginHorizontal: 20 },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImageContainer: {
    width: 320,
    height: 320,
    borderRadius: 180,
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#AAB07F',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 200,
    right: 20,
    padding: 10,
  },
  bottomNavigationWrapper: {
    position: 'absolute', // Keeps it at the bottom
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default styles;