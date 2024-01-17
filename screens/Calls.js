import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import globalStyles from '../styles/GlobalStyles'
import { BORDERRADIUS, COLORS, FONTSIZE } from '../styles/Theme'
import { Image } from 'react-native'

export default function Calls({navigation}) {
  return (
    <View style={[globalStyles.container, { paddingTop: 30, paddingBottom: 8, backgroundColor: COLORS.text_50 }]}>
      <Text style= {globalStyles.title}>Recent</Text>
      

      {/* Item call */}
      <View style={styles.itemContainer}>
       <TouchableOpacity
       style= {{width:"20%"}}
       >
            <Image                    
              resizeMode='cover'
              style= {{width:60, height: 60}}
              source={require('../assets/images/icon_profil.png')}
            />
        </TouchableOpacity>
        <View style={{width:"60%"}}>
          <Text style={{fontSize:FONTSIZE.size_20, fontWeight: "bold"}}>Manar Hedli</Text>
          <View style={{flexDirection:"row", alignItems:"center"}}>
            <Image                    
              resizeMode='cover'
              style= {{width:20, height: 20, tintColor : 'red'}}
              source={require('../assets/images/icon_call_out.png')}
            />
            <Text>12/12/2012 12:12</Text>  
          </View>
        </View>
        <TouchableOpacity 
          onPress={()=>{navigation.navigate("OneCall")}}
          style={{width:"10%"}}
        >  
          <Image                    
              resizeMode='cover'
              style= {{width:30, height: 30, tintColor :COLORS.success_500}}
              source={require('../assets/images/icon_call_green.png')}
          />

        </TouchableOpacity>
        <TouchableOpacity style={{width:"10%"}}>  
          <Image                    
              resizeMode='cover'
              style= {{width:30, height: 30, tintColor :COLORS.success_500}}
              source={require('../assets/images/icon_video_call.png')}
          />
        </TouchableOpacity>                
      </View>                 
    </View>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    height: 70,
    borderBottomWidth: 1,
    borderBlockColor: COLORS.primary_50,
    flexDirection: "row",
    alignItems: "center",
  }
})