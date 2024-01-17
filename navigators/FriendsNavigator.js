import React, { useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Friends from '../screens/Friends';
import Onechat from '../screens/Onechat';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTSIZE } from '../styles/Theme';
import OneCall from '../screens/OneCall';
import ProfileImage from '../components/ProfileImage';
import Calls from '../screens/Calls';


const FriendsStack = createStackNavigator();

export default function FriendsNavigator() {
  
  return (
    <FriendsStack.Navigator>                              
      <FriendsStack.Screen 
        name="Friends"          
        component={Friends}           
        options={{
          headerShown: false,
        }}
      />
      <FriendsStack.Screen 
        name="Chat" 
        component={Onechat} 
        options={({ route }) => ({
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <ProfileImage size={30} profile={route.params.profile}/>             
              <Text style={{ marginLeft: 10, fontSize: FONTSIZE.size_16, fontWeight: "bold", color: COLORS.primary_500 }}>
                {route.params ? route.params.profile.nom + " " + route.params.profile.prenom : 'Default Title'}
              </Text>
              {route.params.profile.isOnLine && (<View style={{width: 10, height: 10, backgroundColor: COLORS.success_500, borderRadius: 10, marginLeft: 10}}/>  )}                     
              {/* <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <TouchableOpacity                  
                 style={{marginStart: 20}}>  
                  <Image                    
                      resizeMode='cover'
                      style= {{width:25, height: 25,  tintColor :COLORS.success_500}}
                      source={require('../assets/images/icon_call_green.png')}
                  />

                </TouchableOpacity>
                <TouchableOpacity style={{marginStart: 20}} >  
                  <Image                    
                      resizeMode='cover'
                      style= {{width:25, height: 25,tintColor :COLORS.success_500}}
                      source={require('../assets/images/icon_video_call.png')}
                  />

                </TouchableOpacity>
              </View> */}
            </View>
          ),
          // headerTitleContainerStyle: {
          //   left: 150, 
          // },
          
        })} /> 
      <FriendsStack.Screen 
        name="Calls" 
        component={Calls} 
        // options={({ route }) => ({
        //   headerTitle: () => (
        //     <View style={{ flexDirection: 'row', alignItems: 'center'}}>             
        //       <Text style={{ marginLeft: 10, fontSize: FONTSIZE.size_16, fontWeight: "bold", color: COLORS.primary_500 }}>
        //         {route.params ? route.params.profile.nom + " " + route.params.profile.prenom : 'Default Title'}
        //       </Text>
        //       {route.params.profile.isOnLine && (<View style={{width: 10, height: 10, backgroundColor: COLORS.success_500, borderRadius: 10, marginLeft: 10}}/>  )}                                   
        //     </View>
        //   )
          
          
        // })} 
      />      
    </FriendsStack.Navigator>
  )
}