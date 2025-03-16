import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
        marginTop: 25,
    },
    headerContainer: {
        flexDirection: 'row',
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
    mealItem: {
        marginBottom: 20,
        alignItems: 'center',
        backgroundColor: '#FFF9DB',
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    mealImage: {
        width: '80%',
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        borderWidth: 1,          // added black border
        borderColor: 'black',    // added black border
    },
    mealName: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: 'PlusJakartaSans-Bold',
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
        margin: 20,
        alignItems: 'center',
    },
    label: {
        fontSize: 20,
        color: '#333',
        marginBottom: 10,
        fontFamily: 'PlusJakartaSans-Bold',
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
        width: '90%', 
        alignSelf: 'center',
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
    pickerOverlay: {
        position: 'absolute',
        top: 140,
        zIndex: 10,
        alignItems: 'center',
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E0C97D',
        alignItems: 'center',
    },
    timeWrapper: {
        marginTop: 20,
        alignItems: 'center',
    },
    timeContainer: {
        width: '80%',
        alignSelf: 'center',
        flexDirection: 'column',
        marginTop: 10,
    },
    timeButton: {
        backgroundColor: '#FFF9DB',
        padding: 10,
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
    },
    timeText: {
        marginLeft: 5,
        fontSize: 16,
        color: '#555',
        fontFamily: 'PlusJakartaSans-Bold',
    },
    selectedTimeButton: {
        backgroundColor: '#AAB07F',
        borderColor: '#333'
    },
    selectedTimeText: {
        color: '#FFF'
    },
    saveContainer: { 
        alignItems: 'flex-end', 
        marginHorizontal: 45, 
        marginVertical: 10,
        marginTop: 20,
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
        bottom: 2,
    },
});

export default styles;