import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import { COLORS, FONTSIZE } from '../styles/Theme';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import { requestCameraPermissionsAsync } from 'expo-image-picker';





export default function OneCall({ navigation, route }) {

    const secondUser = route.params.profile;
    const [status, setStatus] = useState("Connecting ...")

    
    useEffect(() => {
        const getPermissions = async () => {
          const { status: cameraStatus } = await requestCameraPermissionsAsync()          
          const { status: audioStatus } = await Audio.requestPermissionsAsync();    
          if (cameraStatus !== 'granted' || audioStatus !== 'granted') {
            console.log('Permission not granted for camera or audio');
            return;
          }    
        };
    
        getPermissions();
    }, []);





    return (
        <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
            <Image 
                style={{width: 150, height:150, borderRadius: 100}}                                 
                resizeMode='cover'
                source={{ uri : secondUser.image}}                
            />
            <Text
                style={{fontSize: FONTSIZE.size_24, fontWeight:"bold", marginTop:20}}
            > 
                {secondUser.nom } {secondUser.prenom} 
            </Text>
            <Text>{secondUser.phone} </Text>
            <Text 
                style={{color: COLORS.text_200, fontSize: FONTSIZE.size_14}}
            >
                {status}
            </Text>
            <TouchableOpacity
                onPress={() => {                    
                    navigation.replace("Friends");
                  }}
                style={{marginTop:20, width: 50, height:50, borderRadius: 30, backgroundColor: "red", justifyContent:"center", alignItems:"center"}}
                
            >
                <Image style={{ width:30, height: 30}} source={require('../assets/images/icon_call.png')} />                
            </TouchableOpacity>
        </View>
    )
}