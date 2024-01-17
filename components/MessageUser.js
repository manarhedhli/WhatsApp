import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { BORDERRADIUS, COLORS, FONTSIZE, REACTIONS } from '../styles/Theme'
import { Dialog } from 'react-native-paper';

export default function MessageUser({profilePhoto, profileNom,  profileprenom, message, type,  timestamp, openDialog,reactions, currentUserUID, secondUserUID, secondUserName, setLocation, setIsMapDialogVisible}) {
    const [isDialogVisible, setDialogVisible] = useState(false)
    
    const currentUserReaction = reactions && reactions[currentUserUID];
    const secondUserReaction = reactions && reactions[secondUserUID];

    const currentUserName = profileNom + " " +profileprenom

    const openReactionDialog = () => {       
        setDialogVisible(true);
    };
    const closeReactionDialog = () => {        
        setDialogVisible(false);
    };

       
   
   

    
    
    
    return (
        <View style={{padding:10}} >
            <TouchableOpacity
                onLongPress={openDialog}
            >
                <Text style={styles.txtUser}> {currentUserName} </Text>
                <View style={styles.container}>
                    {
                        type === 'Txt' ? (
                            <Text style={styles.txtMessage}>{message}</Text>
                        ) : type === 'Img' ? (
                            <TouchableOpacity>
                                <Image
                                    style={{ width: 150, height: 150 }}
                                    resizeMode='cover'
                                    source={{ uri: message }}
                                />
                            </TouchableOpacity>
                        ) : type === 'Location' ? (                        
                            <View>
                                <TouchableOpacity
                                    onPress={()=>{ 
                                        setIsMapDialogVisible(true);                                     
                                        const newLocation = { coords: message };                                    
                                        setLocation(newLocation)
                                    }}
                                    style={{width: 150, height: 30, backgroundColor: COLORS.text_50, padding:8, justifyContent: "center", alignItems:"center", borderRadius:BORDERRADIUS.radius_10}}
                                >
                                    <Text style={{fontWeight:"bold"}}>View shared Position</Text>
                                </TouchableOpacity>                               
                            </View>
                        ) : null
                    }
                    <Text style={styles.txtDate}> {timestamp} </Text>
                    
                </View>
                { profilePhoto ? (
                    <Image  
                    style={styles.photo}                  
                    resizeMode='cover'
                    source={{ uri : profilePhoto}}                
                />

                ) :
                <View style={[styles.photo, {justifyContent:"center", alignItems: "center", borderRadius: 30, borderWidth: 2, borderColor: COLORS.White, backgroundColor: COLORS.primary_500 }]}>
                        <Text style={{fontWeight:"bold", fontSize:FONTSIZE.size_14, color: COLORS.White}} >                        
                            {profileNom.charAt(0).toUpperCase() + profileprenom.charAt(0).toUpperCase()}
                        </Text>
                </View>
                    
                }               
            </TouchableOpacity>
            {currentUserReaction && secondUserReaction && currentUserReaction === secondUserReaction ? (
            <View style={styles.Row}>
                <TouchableOpacity 
                    onPress={openReactionDialog}
                    style={styles.containerReaction}
                > 
                    <Image
                        style={styles.iconReaction}
                        source={REACTIONS.find((r) => r.name === currentUserReaction).emoji}
                    />
                    <Text style={styles.reactionCount}>2</Text>
                </TouchableOpacity>
            </View>
            ) : (
            <View style={styles.Row}>
                <TouchableOpacity 
                    onPress={openReactionDialog}
                    style={styles.containerReaction}
                >
                {currentUserReaction && (
                <Image  
                    style={styles.iconReaction}
                    source={REACTIONS.find((r) => r.name === currentUserReaction).emoji}
                />
                )}
                {secondUserReaction && (
                <Image 
                    style={styles.iconReaction}
                    source={REACTIONS.find((r) => r.name === secondUserReaction).emoji}
                />
                )}
                </TouchableOpacity>
            </View>
            )}

            <Dialog visible={isDialogVisible}  onDismiss={closeReactionDialog} style={{ position: "absolute" }} dismissable={true}>
                <Dialog.Content >
                    {Object.entries(reactions).map(([userId, reactionName]) => (
                        <View key={userId} style={styles.reactionItem}>
                            <Image
                                style={styles.iconReaction}
                                source={REACTIONS.find((r) => r.name === reactionName).emoji}
                            />
                            {userId == currentUserUID ? 
                                (<Text style={styles.reactionText}>{currentUserName}</Text>): 
                                (<Text style={styles.reactionText}>{secondUserName}</Text>)
                            }                        
                        </View>
                    ))}
                </Dialog.Content>          
            </Dialog>
    
        
        </View>
    )
}

const styles = StyleSheet.create({
    container: {        
        padding: 8,
        paddingTop: 10,
        paddingStart:20,
        borderRadius: 5,
        backgroundColor: COLORS.primary_50,
        alignSelf: "flex-start"
    }, 
    photo: {
        width: 30, 
        height: 30, 
        borderRadius:40,
        position : 'absolute',        
        left: 1,          
    }, 
    txtDate: {
        fontSize: FONTSIZE.size_10,
        textAlign: 'right',
        marginTop:5
    },
    txtMessage: {
        fontSize: FONTSIZE.size_14
    }, 
    txtUser: {
        fontWeight: "bold",
        fontSize: FONTSIZE.size_14,                 
        textAlign: "left",
        paddingStart: 40                
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        height: "100%"
    },
    modalContent: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 16,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    reactionButton: {
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'lightgray',
    },
    reactionEmoji: {
        fontSize: 20,
    },
    reactionCount: {
        fontSize: FONTSIZE.size_14,
        fontWeight: 'bold',
        marginLeft: 5,
        backgroundColor: COLORS.White,
        padding: 2,
        borderRadius: BORDERRADIUS.radius_10
    },
    Row : {
        flexDirection:"row",         
        justifyContent: "flex-start", 
        
    },
    containerReaction: {
        backgroundColor:COLORS.White, 
        flexDirection:"row", 
        borderRadius:BORDERRADIUS.radius_10
    },
    iconReaction : {
        width: 20,
        height: 20
    },
    reactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    reactionText: {
        marginLeft: 10,
    },       
})