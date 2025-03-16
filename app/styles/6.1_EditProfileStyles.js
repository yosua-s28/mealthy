import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containersafe:{
    flex:1,
    height:'100%',
  },
  container: { flex: 1, backgroundColor: '#F7F7F7' },
  profileSection: { alignItems: 'center', paddingVertical: 30 },
  profileImageContainer: { 
    width: 180, 
    height: 180, 
    borderRadius: 90, 
    overflow: 'hidden', 
    marginBottom: 20,
  },
  profileImage: {
    width: '100%', 
    height: '100%',
    resizeMode: 'cover', 
  },
  nameContainer: { flexDirection: 'row', alignItems: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#000', marginRight: 5 },
  pencilIcon: { marginLeft: 5 },
  nameInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    borderBottomWidth: 1,
    borderColor: '#AAB07F',
    paddingHorizontal: 5,
  },
  menuSection: { marginTop: 0, paddingVertical: 5, marginHorizontal: 20 },
  menuGroup: { marginTop: -5, marginBottom: 30 },
  label: { fontSize: 16, color: '#000', marginBottom: 5 },
  inputField: {
    borderBottomWidth: 2,
    borderColor: '#AAB07F',
    paddingVertical: 8,
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.5)',
  },
  cameraIcon: {
    position: 'absolute',
    alignSelf: 'center',
  },
  
  inputError: { borderColor: 'red' },
  errorText: { color: 'red', fontSize: 12, marginTop: 5 },
  saveContainer: { alignItems: 'flex-end', marginHorizontal: 45, marginVertical: 10 },
  saveButton: {
    backgroundColor: '#AAB07F',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});

export default styles;