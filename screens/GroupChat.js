import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Image } from 'react-native'
import { BORDERRADIUS, COLORS } from '../styles/Theme';
import globalStyles from '../styles/GlobalStyles';
import firebase from '../config'
import { AuthContext } from '../context/AuthProvider';
import MessageCurrentUser from '../components/MessageGroup';

export default function GroupChat({ route }) {
    const { group } = route.params;
    console.log("Members ", group.members)
    const authContext = useContext(AuthContext);
    const curentUserUID = authContext.authState.uid;
    const database = firebase.database();
    const ref_groups = database.ref("Groups");
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        const members = group.members || [];
        const updatedMembers = members.filter((member) => member !== curentUserUID);
        updatedMembers.forEach((userId) => {
          const ref_profil = firebase.database().ref("Profils").child(userId);
    
          ref_profil.once("value", (snapshot) => {
            const profileData = snapshot.val();
            console.log("Profile data for user", userId, ":", profileData);
            
            setProfiles((prevProfiles) => ({
              ...prevProfiles,
              [userId]: profileData
            }));           
          });
        });
      }, [curentUserUID, group.members]);
  
    const addMessage = () => {
        console.log("from add message")
        const newMessage = {
            message: message,
            timestamp: new Date().toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }),
        sender: curentUserUID,
        type: 'Txt',
      };      
      ref_groups.child(group.key).child('messages').push(newMessage);
      setMessage('');
    };
  
    useEffect(() => {      
        const messagesRef = ref_groups.child(group.key).child('messages');
    
        const handleMessages = (snapshot) => {
            const messagesData = [];
            snapshot.forEach((messageSnapshot) => {
                const messageData = messageSnapshot.val();
                messagesData.push(messageData);
            });
    
            // Sort messages by timestamp in descending order
            const sortedMessages = messagesData.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
    
            setMessages(sortedMessages);
            console.log(sortedMessages);
        };
    
        messagesRef.on('value', handleMessages);      
        
        return () => {
            messagesRef.off('value', handleMessages);
        };
    }, [group.key]);
    
    
    
    return (
        <View style={[globalStyles.container, {paddingTop: 0}]}>
            {messages && (
                <FlatList
                    showsVerticalScrollIndicator={false}    
                    onEndReachedThreshold={0.1}
                    data={messages}
                    renderItem={({item}) => (
                        <>
                            <MessageCurrentUser message={item} senderProfile={profiles[item.sender]} />
                        
                        </>
                    )}                    
                />
            )}



            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
                <TouchableOpacity  
                    //onPress={openShareDialog}
                >
                <Image style={{width:25, height:25 }} source={require('../assets/images/icon_more.png')} />
                </TouchableOpacity>
                <TextInput
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{ width: '85%', backgroundColor: COLORS.White, padding: 16, borderRadius: BORDERRADIUS.radius_10, paddingEnd: 50 }}
                    placeholder="Message ..."
                    //onFocus={handleTypingStart}
                    //onBlur={handleTypingStop}
                />                
                <TouchableOpacity
                    onPress={addMessage}
                >
                    <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icon_share_msg.png')} />
                </TouchableOpacity>                
            </View>
        </View>
    )
}