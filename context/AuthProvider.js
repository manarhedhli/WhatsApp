import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    
    const [authState, setAuthState] = useState({
        uid: null,
        email: null,        
        uri: null,
        fName: null,
        lName: null,
        phone : null,
        authenticated: false, 
    });

    const logout = async () => {
        try {        
            console.log("From log out")                                      
            await AsyncStorage.removeItem('uid');   
            await AsyncStorage.removeItem('email');                            
            await AsyncStorage.removeItem('uri');  
            await AsyncStorage.removeItem('fName');  
            await AsyncStorage.removeItem('lName');  
            await AsyncStorage.removeItem('phone');  
            setAuthState({
                uid: null,
                email: null,        
                uri: null,
                lName: null,
                fName: null,
                phone : null,
                authenticated: false, 
            });          
        } catch (error) {
            console.log('Error during logout', error);
        }
    };
    const login = async (uid, email) => {
        await AsyncStorage.setItem('uid', uid);
        await AsyncStorage.setItem('email', email);        
        setAuthState({
            uid: uid,
            email: email,        
            uri: null,
            fName: null,
            lName: null,
            phone : null,
            authenticated: true,                     
        });
        console.log('1. Okay connected from login set to storage');
    }
    const checkAuthState = async () => {            
        try {
            const uid = await AsyncStorage.getItem('uid');   
            const email = await AsyncStorage.getItem('email');                            
            const uri = await AsyncStorage.getItem('uri');  
            const fName = await AsyncStorage.getItem('fName');  
            const lName = await AsyncStorage.getItem('lName');  
            const phone = await AsyncStorage.getItem('phone');  
            
            if (email && uid ) {
                setAuthState({
                    uid: uid,
                    email: email,        
                    uri: uri,
                    fName: fName,
                    lName: lName,
                    phone : phone,
                    authenticated: true,                     
                });
                console.log('Okay connected');
            } else {
                console.log('Not connected');
                setAuthState({
                    uid: null,
                    email: null,        
                    uri: null,
                    fName: null,
                    lName: null,
                    phone : null,
                    authenticated: false, 
                });
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'e-mail depuis AsyncStorage:",error)
            setAuthState({
                uid: null,
                email: null,        
                uri: null,
                fName: null,
                lName: null,
                phone : null,
                authenticated: false, 
            });
        }                    
    }
    
    const setProfile = async (uri, fName, lName, phone) => {
        await AsyncStorage.setItem('uri', uri);
        await AsyncStorage.setItem('fName', fName);
        await AsyncStorage.setItem('lName', lName);
        await AsyncStorage.setItem('phone', phone);
        
        setAuthState({
            uid: authState.uid,
            email: authState.email,        
            uri: uri,
            fName: fName,
            lName: lName,
            phone : phone,
            authenticated: true,                     
        });
        console.log('2. set profile info ');
    }

    
    const  getUid = () => authState.uid;
    const  getEmail = () => authState.email;
    const  getUri = () => authState.uri;
    const  getfName = () => authState.fName;
    const  getlName = () => authState.lName;    
    const  getPhone = () => authState.phone;


  
  const contextValue = {
    authState,
    setAuthState,
    getUid, 
    getEmail,
    getUri,
    getfName,
    getlName,
    getPhone, 
    setProfile,
    login,  
    logout,
    checkAuthState
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
