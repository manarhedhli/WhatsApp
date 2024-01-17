import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import globalStyles from '../styles/GlobalStyles'
import { BORDERRADIUS, COLORS, FONTSIZE } from '../styles/Theme'
import firebase from '../config'
import { AuthContext } from '../context/AuthProvider';
import { Image } from 'react-native'
import {  Button, Dialog } from 'react-native-paper'
import ProfileImage from '../components/ProfileImage'
import ItemProfile from '../components/ItemProfile'
import { pickImage, uploadImageLocalToFirebaseStorage } from '../utils/ImageUtils.js'

export default function Friends({navigation}) {
    const authContext = useContext(AuthContext);  
    const [curentUserUID, seCurentUserUID ] = useState(authContext.authState.uid);
    
    const [data, setData] = useState([])
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [valueSearch, setValueSearch] = useState("")

    const [profile, setProfile] = useState(null)
    const database = firebase.database();
    const ref_profils = database.ref("Profils");
    const ref_groups = database.ref("Groups");

    const [checkedItems, setCheckedItems] = useState([]);
    const [isDialogGroupVisible, setIsDialogGroupVisible] = useState(false)
    const [error, setError] = useState("")
    const [groupName, setGroupName] = useState("")
    const [image, setImage] = useState("");

    const [isLoading, setIsLoading]= useState(false)

    const pickImageHandler = async () => {
        console.log("Here")
        const uri = await pickImage();
        if (uri) {
          setImage(uri);
        }
    };

    const createGroup = async() => {   
        setIsLoading(true) 
        if (!groupName) {
          setError("Please provide a group name");
          setIsLoading(false)
          return;
        }            
        const key = Date.now();
        let url = null
        if (image)
            url = await uploadImageLocalToFirebaseStorage(image, "groupImages", key)
        const groupData = {
          name: groupName,
          members: [...checkedItems, curentUserUID],
          image: url
        };              
        ref_groups.push(groupData)
          .then(() => {
            console.log("Group created successfully");
           
            setIsDialogGroupVisible(false);
            setGroupName("");
            setCheckedItems([]);
            setImage(null);
          })
          .catch((error) => {
            setError("Error creating group", error);
          });
          setIsLoading(false)
      };

    const filteredData = data.filter(
        (item) =>
            String(item.uid) !== String(curentUserUID) &&
            (item.nom.toLowerCase().includes(valueSearch.toLowerCase()) ||
            item.prenom.toLowerCase().includes(valueSearch.toLowerCase()))
    );

    const toggleCheckbox = (uid) => {
        const isChecked = checkedItems.includes(uid);
        console.log(checkedItems)
        if (isChecked) {
          setCheckedItems(checkedItems.filter((item) => item !== uid));
        } else {
          setCheckedItems([...checkedItems, uid]);
        }
    };

  
    const openDialog = (profile) => {
        setProfile(profile)
        console.log("profile =",profile)
        setDialogVisible(true);
    };
    const closeDialog = () => {
        setDialogVisible(false);
    };



    useEffect(() => {
        ref_profils.on("value", (snapshot) => {
            let d = [];
            snapshot.forEach((un_profil) => {
                const uid = un_profil.key; 
                const data = un_profil.val();
                d.push({ uid, ...data }); 
            });
            setData(d);    
            const onlineProfiles = d.filter(profile => profile.isOnLine);            
            const numberOfOnlineProfiles = onlineProfiles.length;            
            console.log("Number of online profiles:", numberOfOnlineProfiles);        
    });
        
        
        return () => {
          ref_profils.off();
        };
    }, []);
    return (
        <View style={[globalStyles.container]}>
        <Text style= {globalStyles.title}>My friends</Text>
        <View>
            <TextInput  
                value={valueSearch}
                onChangeText={(text) => { setValueSearch(text) }}  
                placeholder='Search ...'
                style={globalStyles.textInput}
            />
            <Image                    
                resizeMode='cover'
                style= {{width:40, height: 40, position:"absolute", right:8, top:8}}
                source={require('../assets/images/icon_search.png')}
            />
        </View>
        <FlatList
            data={filteredData}            
            renderItem={({ item }) => (
                <View style={{flexDirection:"row", alignItems: "center"}}>
                    <TouchableOpacity style={{width:35, height: 40, marginBottom:6, borderWidth:1, borderRadius:10, borderColor: COLORS.Black, justifyContent:"center", alignItems:"center", backgroundColor: COLORS.primary_50, marginRight:10}} onPress={() => toggleCheckbox(item.uid)}>
                    <Text style={{ fontWeight: "bold"}} >{checkedItems.includes(item.uid) ? '✓' : '○'}</Text>
                    </TouchableOpacity>
                    <ItemProfile profile={item} openDialog={openDialog} navigation={navigation} />
                </View>
            )
            }
            
            
            keyExtractor={item => String(item.uid)}
        />
        {
            checkedItems.length > 1 && (
                <TouchableOpacity
                onPress={() => {
                    setIsDialogGroupVisible(true);
                    console.log("here");
                }}
                >
                <Image
                    style={{ width: 45, height: 45 }}
                    source={require('../assets/images/icon_add.png')}
                />
                </TouchableOpacity>
            )
        }
        <Dialog visible={isDialogVisible} onDismiss={closeDialog}>
            <Dialog.Title style={{fontWeight: "bold"}}>Details</Dialog.Title>
            <Dialog.Content style={{justifyContent: "center", alignItems: "center"}}>
                {profile &&
                <>
                    <ProfileImage size={100} profile={profile} />
                    {/* <Image style={{width:100, height: 100, borderRadius: 50}} source={{ uri: profile.image }}  /> */}
                    <Text style={{marginTop: 20}} > {profile.nom} {profile.prenom}</Text>
                    <Text style={{marginTop: 10}} >{profile.phone}</Text>
                </>
                }
            </Dialog.Content>
            <Dialog.Actions> 
                <Button style={globalStyles.btnDialog} onPress={closeDialog}>
                    <Text style={globalStyles.txtBtnDialog}>Close</Text>
                </Button>
            </Dialog.Actions>
        </Dialog>

        {/* Dialog for group  */}
        <Dialog visible={isDialogGroupVisible} onDismiss={() => setIsDialogGroupVisible(false)}>
        <Dialog.Title style={{ fontWeight: "bold" }}>Create Group</Dialog.Title>
        <Dialog.Content style={{ justifyContent: "center", alignItems: "center" }}>
          <TouchableOpacity
            onPress={pickImageHandler}
            style={{
              borderWidth: 1,
              backgroundColor: COLORS.text_50,
              borderColor: COLORS.text_200,
              borderRadius: 80,
              width: 120,
              height: 120,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Image
              style={{width: 100, height: 100, borderRadius: 60, margin:20,   borderColor:COLORS.primary_500, }}
              resizeMode='cover'
              source={image ? { uri: image } : require('../assets/images/icon_group.png')}
            />
            <Image
              style={{ position: 'absolute', top: 80, left: 80, tintColor: COLORS.White, width: 40, height: 40 }}
              resizeMode='cover'
              source={require('../assets/images/icon_camera.png')}
            />
          </TouchableOpacity>
          <Text style={{color: COLORS.error_500}}>{error}</Text>
          <Text style={{ textAlign: "left", width: "100%", marginBottom: 10, fontSize: FONTSIZE.size_18 }}>Name</Text>
          <TextInput 
            value={groupName}
            onChangeText={(text) => { setGroupName(text); setError("") }}
            style={globalStyles.textInput} 
            placeholder='Name of the group ..' 
        />                                        
        </Dialog.Content>
        <Dialog.Actions>
          <Button 
            style={globalStyles.btnDialog} 
            onPress={createGroup} 
          >
            {
              !isLoading ?  
              (<Text style={globalStyles.txtBtnDialog} >Create</Text>) 
              : (
                <Text style={globalStyles.txtBtnDialog} >loading ...</Text>
              )
            }
            
          </Button>
          <Button 
            style={globalStyles.btnDialog} 
            onPress={() => { 
              setIsDialogGroupVisible(false)               
              setGroupName("");
              setCheckedItems([]);
              setImage(null);
              setError("")
            }} 
          >
            <Text style={globalStyles.txtBtnDialog} >Close</Text>
          </Button>
        </Dialog.Actions>
      </Dialog>
        </View>
  )
}


