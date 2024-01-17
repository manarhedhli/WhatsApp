import { View, Text } from 'react-native'
import React from 'react'
import { COLORS, FONTSIZE } from '../styles/Theme'
import { Image } from 'react-native'

export default function ProfileImage({size, profile}) {
  return (
    <View>
      {profile.image !== null && profile.image !== undefined ? (
        <Image  
          style={{width: size,  height: size, borderRadius:100}}                  
          resizeMode='cover'
          source={{ uri: profile.image }}                
        /> 
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center", width: size, height: size, borderRadius: 50, borderWidth: 2, borderColor: COLORS.White, backgroundColor: COLORS.primary_50 }}>
          <Text style={{ fontWeight: "bold", fontSize: FONTSIZE.size_18 }}>
            {profile.nom.charAt(0).toUpperCase() + profile.prenom.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  )
}

