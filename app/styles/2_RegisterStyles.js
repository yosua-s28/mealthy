import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  containersafe:{
    flex:1,
    height:'100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#FEFAE0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },

  logo: {
    width: 85,
    height: 85,
    marginBottom: 10
  },
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#000',
  },

  inputArea: {
    paddingHorizontal: 5,
    paddingVertical: 20,
    marginBottom: 15,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 300,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#8C8C8C',
    marginTop: 20,
    marginBottom: 5,
    paddingHorizontal: 15,
  },

  errorContainer: {
    width: '100%',
  },

  errorText: {
    color: 'firebrick',
    fontSize: 11,
    marginTop: 1,
    textAlign: 'left',
    marginLeft: 10,
    flexWrap: 'wrap'
  },

  label: {
    position: 'absolute',
    color: '#8C8C8C',
    backgroundColor: '#FEFAE0',
    padding: 5,
    top: -15,
    left: 10,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    marginLeft: 10,
  },

  icon: {
    alignSelf: 'flex-start',
    marginVertical: 15,
    marginLeft: 10, 
  },

  iconRight: {
    marginRight: 15,
    marginLeft: 10,  
  },

  button: {
    width: 300,
    height: 50,
    backgroundColor: '#C0C78C',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },

  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#8C8C8C',
    borderRadius: 10,
  },

  dividerText: {
    color: '#8C8C8C',
    marginHorizontal: 10,
  },

  Registered: {
    color: '#8C8C8C'
  },
});

export default styles;