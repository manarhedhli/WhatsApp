import { StyleSheet } from "react-native";
import { BORDERRADIUS, COLORS, FONTSIZE } from "./Theme";

const globalStyles = StyleSheet.create({
    container: {
        flex: 1,             
        padding: 20,
        paddingTop: 50,
        backgroundColor: COLORS.text_50    
    },
    textInput: {
        backgroundColor: COLORS.White,
        width: "100%",
        height: 60,
        marginBottom: 16,
        padding: 20,
        borderRadius: 20
    
    },
    title :{
        color: COLORS.primary_500,
        fontSize: FONTSIZE.size_30, 
        fontWeight: "bold", 
        marginBottom: 20,
        // textAlign: "center"
    },
    btn: {
        width: 150,
        height: 60,
        backgroundColor: COLORS.primary_500,
        margin: 10,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        // alignSelf: "center"
    },
    txtBtn :{
        fontSize: FONTSIZE.size_22,
        fontWeight: "bold",
        color: COLORS.White
    }, 
    label: {
        fontSize: FONTSIZE.size_18,
        color: COLORS.text_500

    }, 
    txtError: {        
        color: COLORS.error_500, 
        fontWeight: "400", 
        fontSize: FONTSIZE.size_14,     
    }, 
    errorContainer: {
        alignItems: "center",
        marginBottom: 20
    },
    btnDialog :{
        backgroundColor: COLORS.primary_50, 
        paddingHorizontal:20, 
        borderRadius: BORDERRADIUS.radius_10
    },
    txtBtnDialog:{
        color:COLORS.Black, 
        fontWeight:"bold"
    }
    


})

export default globalStyles;