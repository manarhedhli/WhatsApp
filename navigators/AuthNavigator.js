import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Login from '../screens/Login';
import Register from '../screens/Register';
import Home from '../screens/Home';

const AuthStack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <AuthStack.Navigator 
        screenOptions={{                      
            headerShown: false,
        }}   
        >                              
        <AuthStack.Screen name="Login" component={Login} />
        <AuthStack.Screen name="Register" component={Register} />
        <AuthStack.Screen name="Home" component={Home} />
    </AuthStack.Navigator>
  )
}