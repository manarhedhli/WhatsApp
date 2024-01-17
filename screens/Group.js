import { View, Text, Image, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import globalStyles from '../styles/GlobalStyles'
import ItemGroup from '../components/ItemGroup'
import { Button, Dialog } from 'react-native-paper'
import { COLORS, FONTSIZE } from '../styles/Theme'
import firebase from '../config'
import { AuthContext } from '../context/AuthProvider';
import { pickImage, uploadImageLocalToFirebaseStorage } from '../utils/ImageUtils.js';
import ProfileImage from '../components/ProfileImage.js'

export default function Group({navigation}) {
  const authContext = useContext(AuthContext);  
  const [curentUserUID, seCurentUserUID ] = useState(authContext.authState.uid);  
  const database = firebase.database();

  const [isDialogVisible, setIsDialogVisible] = useState(false)


  const ref_groups = database.ref("Groups");  
  const [groupList, setGroupList] = useState([]);
  const [group, setGroup] = useState()
  const [groupMembers, setGroupMembers] = useState()
  const ref_profils = database.ref("Profils");

 


  useEffect(() => {
    const handleData = (snapshot) => {
      const groups = [];
      snapshot.forEach((groupSnapshot) => {
        const groupData = groupSnapshot.val();
        const groupKey = groupSnapshot.key;
          
        if (groupData.members && groupData.members.includes(curentUserUID)) {
          groups.push({ key: groupKey, ...groupData });
        }
      });
      setGroupList(groups);
      console.log(groups);
    };
  
    ref_groups.on('value', handleData);
  
    return () => {
      ref_groups.off('value', handleData);
    };
  }, [curentUserUID]);

  useEffect(() => {
    const fetchMembers = async () => {
      console.log("here")
      if (isDialogVisible==true && group && group.members && group.members.length > 0) {
        const memberKeys = group.members;
        console.log(memberKeys)
  
        
        const memberProfilesPromises = memberKeys.map(async (memberKey) => {
          return ref_profils.child(memberKey).once("value")
            .then((snapshot) => {
              const uid = snapshot.key;
              const data = snapshot.val();
              return { uid, ...data };
            });
        });
  
        try {
          const memberProfiles = await Promise.all(memberProfilesPromises);
          //console.log("Member profiles:", memberProfiles);  
          setGroupMembers(memberProfiles)        
        } catch (error) {
          console.error("Error fetching member profiles:", error);
        }
      }
    };
  
    fetchMembers();
  }, [isDialogVisible, group]);
  
  
  
  

  
  

  return (
    <View style={globalStyles.container}>
      <View>
        <Text style={globalStyles.title}>List groups</Text>        
      </View>
      <FlatList
        data={groupList}            
        renderItem={({ item }) => <ItemGroup group={item} navigation={navigation} setIsDialogVisible= {setIsDialogVisible} setGroup={setGroup} />}
        keyExtractor={item => String(item.key)}            
      />


      <Dialog visible={isDialogVisible} onDismiss={()=>{setIsDialogVisible(false)}}>
        <Dialog.Title style={{fontWeight: "bold"}}>Details</Dialog.Title>
          <Dialog.Content style={{justifyContent: "center", alignItems: "center"}}>
              {group &&
              <>
                <Image  
                  style={{width: 100,  height: 100, borderRadius:100}}                  
                  resizeMode='cover'
                  source={{ uri: group.image }}                
                />
                <Text style={{marginTop: 20, fontSize: FONTSIZE.size_30, fontWeight: "bold"}}> {group.name} </Text>    
                {groupMembers && groupMembers.map((member) => (     
                  <View style={{width: "100%",flexDirection:"row", justifyContent: "flex-start", alignItems:"center", marginBottom:10}} key={member.uid}>
                    <ProfileImage size={30} profile={member}/>
                    <Text >{member.nom} {member.prenom}</Text>
                  </View>                               
                ))}                  
                              
              </>
              }
          </Dialog.Content>
          <Dialog.Actions> 
              <Button style={globalStyles.btnDialog} onPress={()=>{setIsDialogVisible(false)}}>
                  <Text style={globalStyles.txtBtnDialog}>Close</Text>
              </Button>
          </Dialog.Actions>
      </Dialog>
          
    </View>
  );

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
   