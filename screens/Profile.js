import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, StyleSheet, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import globalStyles from '../styles/GlobalStyles'
import { COLORS } from '../styles/Theme'
import firebase from '../config';
import { AuthContext } from '../context/AuthProvider';
import { updateOnlineStatus } from '../config/Auth';
import { ActivityIndicator } from 'react-native-paper';
import { pickImage, uploadImageLocalToFirebaseStorage } from '../utils/ImageUtils.js';

export default function Profile() { 
  const database = firebase.database();
  const authContext = useContext(AuthContext);  

  const [fname, setFname] = useState(authContext.authState.fName);
  const [lname, setLname] = useState(authContext.authState.lName);
  const [phone, setPhone] = useState(authContext.authState.phone);
  const [image, setImage] = useState(authContext.authState.uri);
  const [loading, setLoading] = useState(false)


  const pickImageHandler = async () => {
    const uri = await pickImage();
    if (uri) {
      setImage(uri);
    }
  };

  
  const saveProfile = async () => {
    setLoading(true)
    try {
        const key = authContext.authState.uid        
        const ref_profils = database.ref("Profils");
       
        const ref_profile = ref_profils.child(key);        
        const url = await uploadImageLocalToFirebaseStorage(image, "MesImages", key)
        ref_profile.set({
            "nom": fname,
           'prenom': lname,
            'phone': phone,
            'image': url,
            'isOnLine': true
        })
        .then(() => {
            authContext.setProfile(url, fname, lname, phone);  
            
            setLoading(false) 
            Alert.alert("Profile was updated successfully!");                       
        })
        .catch((error) => {
            Alert.alert("Error");
        });
    } catch (error) {
      console.error("Error :", error);
    }
  };

  const logout = async () => {    
    updateOnlineStatus(authContext.authState.uid,false)     
    authContext.logout()        
  };


  return (
    <View style={globalStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false} >
      <Text style= {globalStyles.title}>Profile</Text>
      <View style={{alignItems: "center"}}>
        <TouchableOpacity 
          onPress={pickImageHandler}
          style={{borderWidth:1, backgroundColor:COLORS.text_50, borderColor:COLORS.text_200, borderRadius: 80, width: 120, height: 120, alignItems: "center", justifyContent: "center", marginBottom: 20}}
        >
          <Image
            style={styles.img}
            resizeMode='cover'
            source={image ? { uri: image } : require('../assets/images/icon_user.png')}
          />
          <Image
              style={{ position: 'absolute', top: 80, left: 80, tintColor: COLORS.White, width:40, height:40 }}
              resizeMode='cover'
              source={require('../assets/images/icon_camera.png')}
          />
        </TouchableOpacity>
        <TextInput
          onChangeText={(text) => { setFname(text) }}
          style={globalStyles.textInput}
          value={fname}
          placeholder='First Name'
        />
        <TextInput
          onChangeText={(text) => { setLname(text) }}
          style={globalStyles.textInput}
          value={lname}
          placeholder='Last Name'
        />
        <TextInput
          onChangeText={(text) => { setPhone(text) }}
          style={globalStyles.textInput}
          placeholder='Phone Number'
          value={phone}
          keyboardType='phone-pad'
        />
        
        <View style={{justifyContent: "center", alignItems: "center"}}>
          <TouchableOpacity
              style={globalStyles.btn}
              onPress={saveProfile}
          >              
            {loading ? 
              (<ActivityIndicator size="small" color= {COLORS.primary_50}></ActivityIndicator>)
              : (<Text style={globalStyles.txtBtn}>Submit</Text>)                
            }            
          </TouchableOpacity>
        </View>

      </View>

      <TouchableOpacity                            
        onPress={logout}
      >
        <View style={{ alignItems:"flex-end", marginTop: 50}}>
          <Image
            source={require('../assets/images/icon_logout.png')}
            style={{}}            
          />
        </View>
      </TouchableOpacity>

      

      </ScrollView>
      
    </View>
  )
}

const styles = StyleSheet.create({   
  img: {
    width: 120, 
    height: 120, 
    borderRadius: 60,
    margin:20, 
    borderWidth:2,
    borderColor:COLORS.primary_500,      
  },
  txtContainer :{
    alignItems:"flex-start", 
    width: "100%",
    paddingStart:30, marginBottom:5
  }})
   