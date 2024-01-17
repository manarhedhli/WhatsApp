import { View, FlatList, TextInput, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import globalStyles from '../styles/GlobalStyles'
import ItemProfile from '../components/ItemProfile'
import firebase from '../config'
import ProfileModal from '../components/ProfileModal'
import { AuthContext } from '../context/AuthProvider'
import { Button, Dialog } from 'react-native-paper'
import { Image } from 'react-native'
import { COLORS } from '../styles/Theme'
// import { Button, Dialog } from 'react-native-paper'
// import { Button, Dialog} from 'react-native-paper';

export default function ListProfiles(props) {
    const authContext = useContext(AuthContext);  
    const [data, setData] = useState([])
    const [isModalVisible, setModalVisible] = useState(false);
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [profile, setProfile] = useState(null)
    

    const openModal = () => {
      setModalVisible(true);
    };
  
    const closeModal = () => {
      setModalVisible(false);
    };

    const openDialog = () => {
      setDialogVisible(true);
    };
  
    const closeDialog = () => {
      setDialogVisible(false);
    };
    
    const database = firebase.database();
    const ref_profils = database.ref("Profils");
    
    useEffect(() => {
      ref_profils.on("value", (snapshot) => {
        let d = [];
        snapshot.forEach((un_profil) => {
          const uid = un_profil.key; // Get the document ID
          const data = un_profil.val();

          d.push({ uid, ...data }); // Include the document ID in the data object
        });
        setData(d);
        console.log("data = ", d);
      });
    
      return () => {
        ref_profils.off();
      };
    }, []);
    


  return (
    <View style={globalStyles.container}>
      
      <Text style= {globalStyles.title}>List of profiles</Text>
      <TextInput 
        placeholder='Search ...'
        style={globalStyles.textInput}
      />
      <FlatList
        data={data.filter(item => item.uid !== authContext.authState.uid)}
        renderItem={({ item }) => <ItemProfile profile={item} setProfile={setProfile} openModal={openDialog} navigation={props.navigation} />}
        keyExtractor={item => item.uid}
      />
      <Dialog visible={isDialogVisible} onDismiss={closeDialog}>
        <Dialog.Title style={{fontWeight: "bold"}}>Details</Dialog.Title>
        <Dialog.Content style={{justifyContent: "center", alignItems: "center"}}>
            {profile &&
              <>
                <Image style={{width:100, height: 100, borderRadius: 50}} source={{ uri: profile.image }}  />
                <Text style={{marginTop: 20}} > {profile.nom} {profile.prenom}</Text>
                <Text style={{marginTop: 10}} >{profile.phone}</Text>
              </>
            }
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={{backgroundColor: COLORS.primary_50, paddingHorizontal:20}} onPress={closeDialog}>Close</Button>
        </Dialog.Actions>
      </Dialog>

        
      <ProfileModal
        visible={isModalVisible}
        onClose={closeModal}
        profile={profile}        
      />                 
    </View>
  )
}