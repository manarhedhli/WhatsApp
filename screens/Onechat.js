import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { ActivityIndicator, Button, Dialog, Modal } from 'react-native-paper';
import { BORDERRADIUS, COLORS, FONTSIZE, REACTIONS } from '../styles/Theme';
import { AuthContext } from '../context/AuthProvider';
import firebase from '../config';
import globalStyles from '../styles/GlobalStyles';
import MessageMe from '../components/MessageMe';
import MessageUser from '../components/MessageUser';
import { Text } from 'react-native';
import { pickImage, uploadImageLocalToFirebaseStorage } from '../utils/ImageUtils.js';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

export default function Onechat({ route }) {
  const authContext = useContext(AuthContext);
  const database = firebase.database();

  const secondUser = route.params.profile;
  const currentUserUID = authContext.authState.uid;
  const chatKey = currentUserUID > secondUser.uid ? `${currentUserUID}-${secondUser.uid}` : `${secondUser.uid}-${currentUserUID}`;
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');


  const [limit, setLimit] = useState(10);
  const [secondUserIsTyping, setSecondUserIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isShareDialogVisible, setIsShareDialogVisible] = useState(false);
  const [isMapDialogVisible, setIsMapDialogVisible] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [messageReacted, setMessageReacted] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState('');

  const [location, setLocation] = useState(null);  
  

  // Send Location 
  const shareLocation = async () => {
    setIsShare(true)
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access location was denied');
      return;
    }
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log("Location ---------", location)
      setIsMapDialogVisible(true)
      
    } catch (error) {
      console.error('Error fetching location:', error);
      Alert.alert('Error fetching location');
    }
  };


  // // Send image 
  const pickImageHandler = async () => {
    console.log("Form picking image ... ")
    const uri = await pickImage();
    console.log("uri returned drom pickImage = ", uri)
    if (uri) {
      //setUri(uri);
      console.log("Calling handleImageSelected...");
      handleImageSelected(uri);
    }
  };
  const handleImageSelected = async (uri) => {
    console.log("uri from handle Image Selected ",uri)    
    const url = await uploadImageLocalToFirebaseStorage(uri, "ChatImages", chatKey)
    if (url){
      addMessage(url, "Img")
      //setUri("")
      setIsShareDialogVisible(false)
    }
      
  };
  
  const openDialog = () => {       
    setDialogVisible(true);
  };
  const closeDialog = () => {
      setMessageReacted("")
      setSelectedReaction("")
      setDialogVisible(false);
  };

  const openShareDialog = () => {       
    setIsShareDialogVisible(true);
  };
  const closeShareDialog = () => {
    setIsShareDialogVisible(false);
  };  
      

  useEffect(() => {
    if (selectedReaction && currentUserUID && messageReacted) {
      const ref_chat = database.ref().child('chats').child(chatKey).child("Messages");
  
      const updateMessage = () => {
        ref_chat.child(`${messageReacted}/reactions/${currentUserUID}`).set(selectedReaction);
      };  
      updateMessage();
      return () => {        
      };
    }
  }, [selectedReaction, currentUserUID, messageReacted, chatKey]);
      
          
  const addMessage = (msg, type) => {
    if (msg == "")
      return
    updateTypingStatus(currentUserUID, false);
    const ref_chat = database.ref().child('chats').child(chatKey).child("Messages");
    const key = ref_chat.push().key;
    if (type == "Location" ){
      msg = {
        longitude: msg.longitude,
        latitude: msg.latitude
      };
    }

    ref_chat.child(`message${key}`).set({
      message : msg,
      type : type,
      sender: currentUserUID,
      receiver: secondUser.uid,
      timestamp: new Date().toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      reactions: {},
    });
    setMessage("")    
  };

  // Count messages
  useEffect(() => {
    const refMessages = database.ref('chats').child(chatKey).child('Messages');
    // Initial count
    refMessages.once('value', (snapshot) => {
      setMessageCount(snapshot.numChildren());
    });
    const messageAddedListener = refMessages.on('child_added', () => {
      setMessageCount((prevCount) => prevCount + 1);
      
    });
    return () => {      
      refMessages.off('child_added', messageAddedListener);
    };
  }, [chatKey, database]);

  // Load message 
  useEffect(() => {
    const ref_chat = database.ref().child('chats').child(chatKey).child("Messages");

    const onDataChange = (snapshot) => {
      let newMessages = [];
      snapshot.forEach((messageSnapshot) => {
        const messageId = messageSnapshot.key;
        const messageData = messageSnapshot.val();
        const reactions = messageData.reactions || {}; 
        newMessages.push({ chatKey, messageId, ...messageData, reactions });
      });

      newMessages.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
      const lastMessages = newMessages.slice(0, limit);

      setMessages(lastMessages);      
      setLoading(false);
      
    };
  
    ref_chat.orderByChild('timestamp').limitToLast(limit).on('value', onDataChange);

    return () => {
      ref_chat.off('value', onDataChange);
    };
  }, [currentUserUID, secondUser.uid, limit, messageReacted]);
  
  const handleEndReached = () => {    
    if (limit> messageCount) {
      console.log("here")
      return
    }       
    setLoading(true);
    setLimit((prevLimit) => prevLimit + 10);
  };

  // Status is typing 
  useEffect(() => {
    const ref_chat = database.ref().child('chats').child(chatKey).child('typingStatus');
    const onDataTypingChange = (snapshot) => {
      const typingStatus = snapshot.val();      
      if (typingStatus && typingStatus[secondUser.uid] !== undefined) {
        const isTyping = typingStatus[secondUser.uid].isTyping;        
        setSecondUserIsTyping(isTyping)        
      }
    };
    ref_chat.on('value', onDataTypingChange);
    return () => {
      ref_chat.off('value', onDataTypingChange);
    };
  }, [chatKey, secondUser.uid]);


  const updateTypingStatus = (userId, isTyping) => {
    const ref_chat = database.ref().child('chats').child(chatKey).child('typingStatus').child(userId);
    ref_chat.update({
      isTyping: isTyping,
    });
  };
  
  const handleTypingStart = () => {
    updateTypingStatus(currentUserUID, true);
  };
  const handleTypingStop = () => {
    updateTypingStatus(currentUserUID, false);
  };
  

  return (
    <View style={[globalStyles.container, {paddingTop: 0}]}>
      {secondUserIsTyping &&
      <>
        <View style={{ width:"100%", alignItems: "center", flexDirection: "row"}}>
          <Image  
            style={{width: 30, height: 30, borderRadius:40,                  
            }}                  
            resizeMode='cover'
            source={{ uri : secondUser.image}}                
          />
            <Text style = {{marginStart: 10}}><Text style={{fontWeight:"bold"}}>{secondUser.nom} {secondUser.prenom}</Text> is typing ....</Text>

        </View>
      </>
     }   
      
      {messages && (
        <FlatList
          onEndReached={handleEndReached}        
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}                    
          data={messages.filter((item) => item.uid !== authContext.authState.uid)}
          renderItem={({ item }) => (
            <>             
              {item.sender === authContext.authState.uid ? (
                <MessageMe                                                                      
                  key={item.messageId}
                  openDialog={()=>{openDialog(); setMessageReacted(item.messageId)}}
                  profilePhoto={authContext.authState.uri}
                  profileNom={authContext.authState.fName}
                  profileprenom={authContext.authState.lName}
                  secondUserName={secondUser.nom+" "+secondUser.prenom}
                  message={item.message}
                  type={item.type}
                  timestamp={item.timestamp}
                  reactions={item.reactions}
                  currentUserUID={currentUserUID}
                  secondUserUID={secondUser.uid}
                  setLocation={setLocation}
                  setIsMapDialogVisible={setIsMapDialogVisible}
                />
              ) : (
                <MessageUser                  
                  key={item.messageId}
                  openDialog={()=>{openDialog(); setMessageReacted(item.messageId)}}
                  profilePhoto={secondUser.image}
                  profileNom={secondUser.nom}
                  profileprenom={secondUser.prenom}
                  secondUserName={authContext.authState.fName+" "+authContext.authState.lName}
                  message={item.message}
                  type={item.type}
                  timestamp={item.timestamp}                  
                  reactions={item.reactions}
                  currentUserUID={secondUser.uid}
                  secondUserUID={currentUserUID}
                  setLocation={setLocation}
                  setIsMapDialogVisible={setIsMapDialogVisible}
                />
              )}
            </>
          )}
          ListFooterComponent={() => loading && <ActivityIndicator size="small" color={COLORS.brand} />}
        />
      )}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10 }}>
        <TouchableOpacity  onPress={openShareDialog} >
          <Image style={{width:25, height:25 }} source={require('../assets/images/icon_more.png')} />
        </TouchableOpacity>
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{ width: '85%', backgroundColor: COLORS.White, padding: 16, borderRadius: BORDERRADIUS.radius_10, paddingEnd: 50 }}
          placeholder="Message ..."
          onFocus={handleTypingStart}
          onBlur={handleTypingStop}
        />                
        <TouchableOpacity onPress={()=>{addMessage(message, "Txt")}} >
          <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icon_share_msg.png')} />
        </TouchableOpacity>
        
      </View>


      {/* ---------------Modal Emoji */}
      <Dialog visible={isDialogVisible}  onDismiss={closeDialog}>
        <Dialog.Actions style={{justifyContent:"space-around"}}>
        {
        REACTIONS.map((reaction) => (
          <TouchableOpacity 
            key={reaction.name}
            onPress={() => {setSelectedReaction(reaction.name)}}
          >
            <Image
              source={reaction.emoji}
            />
          </TouchableOpacity>
        ))
      }

        </Dialog.Actions>              
      </Dialog>

      {/* Modale Share */}
      <Dialog visible={isShareDialogVisible}  onDismiss={closeShareDialog}>
        <Dialog.Actions style={{flexDirection:"column"}}>
          
          <TouchableOpacity 
            onPress={pickImageHandler}
            style={{ flexDirection:"row", alignItems:"center", paddingVertical:10, borderBottomWidth:2, borderBottomColor:COLORS.text_50, marginBottom: 20, width: "100%"}}
          >
            <Image style={{ tintColor:COLORS.text_500, marginRight:20 }} source={require('../assets/images/icon_image.png')} />
            <Text style={{fontSize:FONTSIZE.size_18}}>Share Image</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={shareLocation}
            style={{ flexDirection:"row", alignItems:"center", paddingVertical:10, borderBottomWidth:2, borderBottomColor:COLORS.text_50, marginBottom: 20, width: "100%"}}
          >
            <Image style={{ tintColor:COLORS.text_500, marginRight:20  }} source={require('../assets/images/icon_location.png')} />
            <Text style={{fontSize:FONTSIZE.size_18}}>Share Location</Text>
          </TouchableOpacity>

        </Dialog.Actions>              
      </Dialog>
      

      {/* Map Dialog  */}
      <Dialog style={{height:"90%"}} visible={isMapDialogVisible} onDismiss={() => setIsMapDialogVisible(false)}>
        <Dialog.Title style={{textAlign:"center", fontWeight:"bold"}}> {isShare ? "Share my Location" : "Shared positions"} </Dialog.Title>
        <Dialog.Content>
          {location && (
            <MapView
              style={{ width: '100%', height: "80%" }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="My Location"
              />
            </MapView>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={globalStyles.btnDialog} onPress={() => setIsMapDialogVisible(false)}>
            <Text style={globalStyles.txtBtnDialog}>Close</Text>
          </Button>
          {isShare && (
            <Button style={globalStyles.btnDialog} onPress={() => {
              console.log(location.coords)
              addMessage(location.coords,"Location" ) 
              setIsMapDialogVisible(false)
              setIsShareDialogVisible(false)
            }}>
              <Text style={globalStyles.txtBtnDialog}>Share</Text>
            </Button>

          )}
            
        </Dialog.Actions>
      </Dialog>
      
      
    </View>
  );
}
//{"coords": {"accuracy": 100, "altitude": 63, "altitudeAccuracy": 100, "heading": 0, "latitude": 35.8187618, "longitude": 10.6366131, "speed": 0}, "mocked": false, "timestamp": 1702204713391}