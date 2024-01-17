import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS, FONTSIZE } from '../styles/Theme'

export default function ItemGroup({group, navigation, setIsDialogVisible, setGroup}) {
    console.log(group)
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={{width:"20%"}} 
                onPress={()=>{setIsDialogVisible(true); setGroup(group)}}
            >           
                <Image  
                    style={{width: 45,  height: 45, borderRadius:100}}                  
                    resizeMode='cover'
                    source={{ uri: group.image }}                
                /> 
                
            </TouchableOpacity>
            <View style={{width:"70%"}}>
                <Text style={{fontSize: FONTSIZE.size_16}}> {group.name} </Text>
                <Text style={{fontSize: FONTSIZE.size_14, color: COLORS.text_200}}> {group.members.length} members </Text>
            </View>
            <TouchableOpacity 
            
                onPress={()=>{navigation.navigate("GroupChat", { group: group })}}
                style={{width:"10%"}}
            >
                <Image                    
                    resizeMode='cover'
                    style= {{width:40, height: 40}}
                    source={require('../assets/images/icon_chat.png')}
                />
            </TouchableOpacity>
              
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        backgroundColor: COLORS.White, 
        height: 60, 
        borderRadius: 8, 
        padding: 10, 
        marginBottom:10
    },
    btn: {
        width: 40,
        height: 40,        
        
    }, 
    photo: {
        width: 40, 
        height:45, 
        borderRadius:45,
        
    }
})