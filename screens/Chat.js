import { View, Image, TouchableOpacity, TextInput, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { Alert } from 'react-native';
import globalStyles from '../styles/GlobalStyles';
import MessageMe from '../components/MessageMe';
import MessageUser from '../components/MessageUser';
import { COLORS } from '../styles/Theme';
import { AuthContext } from '../context/AuthProvider';
import firebase from '../config';

export default function Chat({ route, navigation }) {
  const flatListRef = useRef(null);
  const database = firebase.database();
  const profile = route.params.profile;
  const authContext = useContext(AuthContext);

  const [message, setMessage] = useState('');
  const [currentId, setCurrentId] = useState(authContext.authState.uid);
  const [secondId, setSecondId] = useState(profile.uid);
  const [messages, setMessages] = useState([]);
  const [limit, setLimit] = useState(8); 
  const [loading, setLoading] = useState(false);


    const loadMoreMessages = () => {
    if (messages.length >= limit) {
      setLoading(true);
      setLimit((prevLimit) => prevLimit + 10);        
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        //setLoading(false);
    }
    };

  useEffect(() => {
    const chatkey = currentId > secondId ? `${currentId}-${secondId}` : `${secondId}-${currentId}`;
    const ref_chat = database.ref().child('chats').child(chatkey);

    const onDataChange = (snapshot) => {
      let newMessages = [];
      snapshot.forEach((messageSnapshot) => {
        const messageId = messageSnapshot.key;
        const messageData = messageSnapshot.val();
        newMessages.push({ chatkey, messageId, ...messageData });
      });
      setMessages(newMessages); // Reverse the array to maintain the correct order

      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }

    };

    ref_chat.limitToLast(limit).on('value', onDataChange);

    return () => {
      ref_chat.off('value', onDataChange);
    };
  }, [currentId, secondId, limit]);

  const addMessage = () => {
    const ref_chats = database.ref().child('chats');
    const chatkey =
      currentId > secondId ? currentId + '-' + secondId : secondId + '-' + currentId;
    const ref_chat = ref_chats.child(chatkey);
    const key = ref_chat.push().key;
    ref_chat
      .child('message' + key)
      .set({
        message: message,
        sender: currentId,
        receiver: secondId,
        timestamp: new Date().toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      })
      .then(() => {
        // Après avoir ajouté le message, faire défiler automatiquement vers le bas
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
      })
      .catch((error) => {
        Alert.alert('Error');
      });    
  }; 

  return (
    <View style={[globalStyles.container, { paddingTop: 10, paddingBottom: 8, backgroundColor: COLORS.text_50 }]}>
      {messages && (
        <FlatList
          ref={flatListRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        //   inverted
          onEndReached={loadMoreMessages}
          onEndReachedThreshold={0.1}
          data={messages.filter((item) => item.uid !== authContext.authState.uid)}
          renderItem={({ item }) => {
            return item.sender === authContext.authState.uid ? (
              <MessageMe
                key={item.messageId}
                profilePhoto={authContext.authState.uri}
                profileNom={authContext.authState.fName}
                profileprenom={authContext.authState.lName}
                message={item.message}
                timestamp={item.timestamp}
              />
            ) : (
              <MessageUser
                key={item.messageId}
                profilePhoto={profile.image}
                profileNom={profile.nom}
                profileprenom={profile.prenom}
                message={item.message}
                timestamp={item.timestamp}
              />
            );
          }}
          ListFooterComponent={() => loading && <ActivityIndicator size="small" color={COLORS.brand} />}
        />
      )}
       {loading && <ActivityIndicator style={{ marginBottom: 16 }} size="small" color={COLORS.brand} />}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
        <TextInput
          value={message}
          onChangeText={(text) => {
            setMessage(text);
          }}
          style={styles.input}
          placeholder="Message ..."
        />
        <TouchableOpacity onPress={addMessage} style={{ width: 50, height: 50, borderRadius: 30, alignContent: 'center', alignItems: 'center' }}>
          <Image style={{ width: 45, height: 45 }} source={require('../assets/images/icon_reply.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '85%',
    backgroundColor: COLORS.White,
    borderRadius: 30,
    height: 50,
    padding: 16,
  },
});


