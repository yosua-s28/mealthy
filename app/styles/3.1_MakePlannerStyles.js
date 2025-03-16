import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        marginTop: 0, 
        alignContent: 'center',

    },
    headerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        position: 'relative',
        backgroundColor: '#C0C78C',
    },
    headerTitle: {
        fontSize: 24,
        color: '#333',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    backButtonHeader: {
        position: 'absolute',
        left: 15,
        padding: 10,
    },
    scrollContainer: {
        paddingBottom: 75,
    },
    mealImage: {
        width: '90%',
        marginTop: 2,
        height: 220, 
        borderRadius: 15, 
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'black',
        borderBottomWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    mealName: {
        fontSize: 18,
        fontFamily: 'PlusJakartaSans-Bold',
        textAlign: 'center',
        backgroundColor: '#FFF9DB',
        padding: 10,
        borderRadius: 15,
        borderWidth: 1,
        width: '90%',
        borderTopWidth: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        alignSelf: 'center',
    },
    mealButton: {
        backgroundColor: '#F7F7F7',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        fontSize: 16,
        color: '#555',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    dateWrapper: {
        marginTop: 0,
        width: '90%',
        alignItems: 'flex-start',
        alignSelf: 'center',
        
    },
    label: {
        fontSize: 20,
        color: '#333',
        marginBottom: 10,
        fontFamily: 'PlusJakartaSans-Bold',
        textAlign: 'left',
    },
    pickerOverlay: {
        position: 'absolute',
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
        width: '100%',
        zIndex: 10,
    },
    icon: {
        marginRight: 10,
        color: '#555',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    timeWrapper: {
        marginTop: 20,
        width: '90%',
        alignItems: 'flex-start',
        alignSelf: 'center',
    },
    timeContainer: {
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'column',
        marginTop: -5,
        alignContent:'center',
    },
    timeButton: {
        backgroundColor: '#FFF9DB',
        padding: 12,  
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'black',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginBottom:10,
    },
    timeText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#555',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    selectedTimeButton: {
        backgroundColor: '#AAB07F',
        borderColor: '#333',
    },
    selectedTimeText: {
        color: '#FFF',
    },
    saveContainer: {
        alignItems: 'flex-end',
        marginHorizontal: 20,
        marginVertical: 10,
        marginTop: 20,
        width: '90%',
    },
    saveButton: {
        backgroundColor: '#AAB07F',
        paddingVertical: 10,
        paddingHorizontal: 40,
        borderRadius: 10,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontFamily: 'PlusJakartaSans-Bold',
    },
});

export default styles;
