import { Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Profile from '../screens/Profile';

import { COLORS } from '../styles/Theme';

import Group from '../screens/Group';

import FriendsNavigator from './FriendsNavigator';
import firebase from '../config';
import GroupNavigator from './GroupNavigator';


const Tab = createBottomTabNavigator();

export default function MainNavigator() {
    const database = firebase.database();
    const ref_profils = database.ref("Profils");
    const [connectedUsersCount, setConnectedUsersCount] = useState(0);
    console.log(connectedUsersCount)

    useEffect(() => {        
        const onlineRef = ref_profils.orderByChild('isOnLine').equalTo(true);              
        const onlineListener = onlineRef.on('value', (snapshot) => {          
        const numberOfOnlineProfiles = snapshot.numChildren();
            
        setConnectedUsersCount(numberOfOnlineProfiles-1);
        
        console.log("Number of online profiles:", numberOfOnlineProfiles);
    });              
        return () => {
          onlineRef.off('value', onlineListener);
        };
    }, []);
      
    
    return (
    <Tab.Navigator
            initialRouteName="FriendsNav"
            screenOptions={{
                tabBarActiveTintColor: COLORS.brand,                              
            }}                
    >            
        <Tab.Screen             
            name="FriendsNav" 
            component={FriendsNavigator} 
            options={{
                tabBarLabel: 'Friends',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Image
                        source={require('../assets/images/icon_chatt.png')}
                        style={{ width: size, height: size, tintColor: color }}
                    />
                ),
                tabBarBadge: connectedUsersCount,
                tabBarBadgeStyle: { backgroundColor: COLORS.success_500, color: COLORS.White }
            }}
        />
        <Tab.Screen             
            name="GroupNav" 
            component={GroupNavigator} 
            options={{
                tabBarLabel: 'Groups',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Image
                        source={require('../assets/images/icon_group.png')}
                        style={{ width: size+10, height: size+10, tintColor: color }}
                    />
                ),
            }}
        />
            
        <Tab.Screen 
            name="Profile" 
            component={Profile}
            options={{
                tabBarLabel: 'Profile',
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                    <Image
                        source={require('../assets/images/icon_profil.png')}
                        style={{ width: size +10, height: size+10, tintColor: color }}
                    />
                ),
            }}
        />
        </Tab.Navigator>

  )
}