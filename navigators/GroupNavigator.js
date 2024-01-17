import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Calls from '../screens/Calls';
import OneCall from '../screens/OneCall';
import JoinCall from '../screens/JoinCall';
import Group from '../screens/Group';
import GroupChat from '../screens/GroupChat';
import { Image, Text, View } from 'react-native';
import { COLORS, FONTSIZE } from '../styles/Theme';



const GroupStack = createStackNavigator();

export default function GroupNavigator() {  
  
  return (
    <GroupStack.Navigator>                              
      <GroupStack.Screen 
        name="Group"          
        component={Group}           
        options={{
          headerShown: false,
        }}
      />
      <GroupStack.Screen 
        name="GroupChat" 
        component={GroupChat} 
        options={({ route }) => ({
          headerTitle: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
              <Image  
                    style={{width: 45,  height: 45, borderRadius:100}}                  
                    resizeMode='cover'
                    source={{ uri: route.params.group.image }}                
                /> 
              <Text style={{ marginLeft: 10, fontSize: FONTSIZE.size_16, fontWeight: "bold", color: COLORS.primary_500 }}>
                {route.params.group.name}
              </Text>
            </View>
          )})}
      />         
    </GroupStack.Navigator>
  )
}