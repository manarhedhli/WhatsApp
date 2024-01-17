import { View, Text, Modal, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { FONTSIZE } from '../styles/Theme';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProfileModal({visible, onClose,profile }) {
    console.log(profile)
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            {profile &&
            (<>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Icon name='close' size={30} color='black'/>
                </TouchableOpacity>
                <Image source={{ uri: profile.image }} style={styles.profileImage} />
                <Text style={styles.username}>{profile.nom} {profile.prenom} </Text>
                <Text style={styles.phone}>{profile.phone}</Text>
                
            </>
            )            
        }
          
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
    
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: "75%",        
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 10,
        alignItems: 'center',
    },
    profileImage: {
      width: 150,
      height: 150,
      borderRadius: 100,
      marginBottom: 10,
    },
    username: {
      fontSize: FONTSIZE.size_30,
      fontWeight: 'bold',
      marginVertical: 10,
    },
    phone: {
      fontSize: FONTSIZE.size_20,
      marginBottom: 10,
    },
    closeButton: {
        position: "absolute",
        top: 10,
        right: 20   
    },
  });
  