import { View, Text, Image } from 'react-native'
import React from 'react'

export default function Logo() {
  return (    
    <View style={{flexDirection: "row", alignItems: "center", justifyContent:"center", marginBottom: 60 }}>
        <Image
            resizeMode='cover'
            source={require('../assets/images/icon.png')}            
        />
        <Image
            style={{marginTop: 40 }}
            resizeMode='cover'
            source={require('../assets/images/WhatsApp.png')}            
        />       
    </View>
    
  )
}