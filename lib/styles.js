import { StyleSheet } from 'react-native';

export const darkColour2 = '#231942';
export const darkColour1 = '#5E548E';
export const mediumColour = '#9F86C0';
export const lightColour1 = '#BE95C4';
export const lightColour2 = '#E0B1CB';

export default styles = StyleSheet.create({
    container: {
        backgroundColor: "#231942",
        flexDirection: "column",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        paddingTop:10,
        alignItems: "center"
    },
    heading: {
        fontSize: 40,
        fontWeight: "200",
        color: "#FFFFFF",
        lineHeight: 50,
        paddingTop:30,
    },
    heading3: {
        color: "#FFFFFF",
        fontSize: 25,
        padding: 30,
        paddingTop: 50,
        lineHeight: 35,
        fontWeight: "300"
    },
    heading4: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "300"
    },
    heading5: {
        color: "#FFFFFF",
        fontSize: 15,
        paddingLeft: 10,
        fontWeight: "300"
    },
    highlight1: {
        color: "#9F86C0",
        fontWeight: "400",
        // textTransform: "uppercase"
    },
    buttonContainer: {
        // justifyContent: "flex-end",
        alignContent: "space-between",
        paddingBottom: 30,
        paddingTop: 10,
        paddingHorizontal:30,
        flexWrap: "wrap",
        // backgroundColor: "#000000",
        height: 90,
        width: "100%",
        flexDirection: "row-reverse"
    },
    button: {
        width: "33%",
        padding:15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        elevation: 9,
        backgroundColor: '#FFFFFF',
    },
    buttonText: {
        fontSize:20,
        color: "#5E548E"
    },
    clearButtonContainer: {
        alignContent: "space-between",
        paddingBottom: 30,
        flexWrap: "wrap",
        width: "100%",
        flexDirection: "row"
    },
    clearButton: {
        padding:10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        minWidth: "25%",
        margin:5,
    },
    clearButtonText: {
        fontSize:12,
        color: "#FFFFFF"
    },
    clearButtonSelected: {
        padding:10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        minWidth: "25%",
        margin:5,
        backgroundColor: "#FFFFFF",
    },
    clearButtonTextSelected: {
        fontSize:12,
        color: "#231942"
    },
    inputStyle: {
      color: "#FFFFFF",
      borderBottomWidth: 1,
      borderBottomColor: "#FFFFFF",
      placeholderTextColor: "#FFFFFF",
      paddingTop: 15
    },
    inputStyle2: {
        color: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#FFFFFF",
        placeholderTextColor: "#FFFFFF",
      },
    loginText: {
      color: "#FFFFFF",
      paddingVertical: 15
    },
    overlay: {
        backgroundColor: "#FFFFFF"
    },
    alignedFormText: {
        color: "#FFFFFF",
        fontSize: 15,
        paddingRight: 10,
        fontWeight: "300",
        paddingTop: 10
    },
    dimmedAlignedFormText: {
        color: "#999999",
        fontSize: 15,
        paddingRight: 10,
        fontWeight: "300",
        paddingTop: 10
    },
    imageContainer1: {
        flexDirection: "row",
        flexWrap: "wrap"
    },
    imageBox: {
        flex: 1,
        minWidth: 150,
        padding: 5,
    },
    imageButton: {
        borderColor: "#FFFFFF",
        borderWidth: 2,
        height: undefined,
        aspectRatio: 1/1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderStyle: 'dashed',
    },
    imageButtonIcon: {
        color: "#FFFFFF"
    },
    imageContainer2outer: {
        flex: 1,
        minWidth: 150,
        padding: 5,
    },
    imageContainer2inner: {
        borderColor: "#FFFFFF",
        borderWidth: 2,
        height: undefined,
        aspectRatio: 1/1,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        borderStyle: 'dashed',
    },
  });