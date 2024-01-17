import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useContext, useState } from 'react'
import { BORDERRADIUS, COLORS, FONTSIZE, REACTIONS } from '../styles/Theme.js'
import {  Dialog } from 'react-native-paper';
import { downloadImageToLocal } from '../utils/ImageUtils.js.js';
import * as Permissions from 'expo-permissions';
import { AuthContext } from '../context/AuthProvider.js';


export default function MessageGroup({message, senderProfile}) {
    const authContext = useContext(AuthContext);  
    const [curentUserUID, seCurentUserUID ] = useState(authContext.authState.uid);
    
    //console.log(message)
    console.log("here", senderProfile)
  
    
    return (
        // <View style={{padding:10}} >
        //     <TouchableOpacity  >
        //         <Text style={styles.txtUser}>Manar hedhli</Text>
        //         <View style={styles.container}>
                    
                    
        //         {
        //             type === 'Txt' ? (
        //                 <Text style={styles.txtMessage}>{message}</Text>
        //             ) : type === 'Img' ? (
        //                 <TouchableOpacity                        
        //                 >
        //                     <Image
        //                         style={{ width: 150, height: 150 }}
        //                         resizeMode='cover'
        //                         source={{ uri: message }}
        //                     />
        //                 </TouchableOpacity>
        //             ) : type === 'Location' ? (                                            
        //                 <View>
        //                     <TouchableOpacity
        //                         onPress={()=>{ 
        //                             setIsMapDialogVisible(true);                                     
        //                             const newLocation = { coords: message };                                    
        //                             setLocation(newLocation)
        //                         }}
        //                         style={{width: 150, height: 30, backgroundColor: COLORS.text_50, padding:8, justifyContent: "center", alignItems:"center", borderRadius:BORDERRADIUS.radius_10}}
        //                     >
        //                         <Text style={{fontWeight:"bold"}}>View shared Position</Text>
        //                     </TouchableOpacity>                               
        //                 </View>                        
        //             ) : null
        //         }
                        
        //         <Text style={styles.txtDate}> {timestamp} </Text>
        //         </View>
        //         <Image
        //             style={styles.photo}
        //             resizeMode='cover'
        //             source={{ uri : profilePhoto}}
        //         />
        //     </TouchableOpacity> 
        
        //     {currentUserReaction && secondUserReaction && currentUserReaction === secondUserReaction ? (
        //     <View style={styles.Row}>
        //         <TouchableOpacity 
        //             onPress={openReactionDialog}
        //             style={styles.containerReaction}
        //         > 
        //             <Image
        //                 style={styles.iconReaction}
        //                 source={REACTIONS.find((r) => r.name === currentUserReaction).emoji}
        //             />
        //             <Text style={styles.reactionCount}>2</Text>
        //         </TouchableOpacity>
        //     </View>
        //     ) : (
        //     <View style={styles.Row}>
        //         <TouchableOpacity 
        //             onPress={openReactionDialog}
        //             style={styles.containerReaction}
        //         >
        //         {currentUserReaction && (
        //         <Image  
        //             style={styles.iconReaction}
        //             source={REACTIONS.find((r) => r.name === currentUserReaction).emoji}
        //         />
        //         )}
        //         {secondUserReaction && (
        //         <Image 
        //             style={styles.iconReaction}
        //             source={REACTIONS.find((r) => r.name === secondUserReaction).emoji}
        //         />
        //         )}
        //         </TouchableOpacity>
        //     </View>
        //     )}

        //     <Dialog visible={isDialogVisible}  onDismiss={closeReactionDialog} style={{ position: "absolute" }} dismissable={true}>
        //         <Dialog.Content >
        //             {Object.entries(reactions).map(([userId, reactionName]) => (
        //                 <View key={userId} style={styles.reactionItem}>
        //                     <Image
        //                         style={styles.iconReaction}
        //                         source={REACTIONS.find((r) => r.name === reactionName).emoji}
        //                     />
        //                     {userId == currentUserUID ? 
        //                         (<Text style={styles.reactionText}>{currentUserName}</Text>): 
        //                         (<Text style={styles.reactionText}>{secondUserName}</Text>)
        //                     }                        
        //                 </View>
        //             ))}
        //         </Dialog.Content>          
        //     </Dialog>            
        // </View>
        <View>
            { message.sender == curentUserUID ? 
                (                
                    <View style={{padding:10}} >                        
                        <Text style={styles.txtUser}>{authContext.authState.fName} {authContext.authState.lName}</Text>
                        <View style={styles.containercCurrentUser}>                                                                    
                            <Text style={styles.txtMessage}>{message.message}</Text>
                            <Text style={styles.txtDate}> {message.timestamp} </Text>                                                        
                        </View>                                                
                        
                        <Image
                            style={styles.photoCurrentUser}
                            resizeMode='cover'
                            source={{ uri : authContext.authState.uri}}
                        />
                    </View>                                                                
                ) : 
                (
                <View style={{padding:10}} > 
                    <TouchableOpacity>                    
                        <Text style={styles.txtUserOtherUser}>{senderProfile.nom} {senderProfile.prenom}</Text>
                        <View style={styles.containerOtherUser}>                                                                    
                            <Text style={styles.txtMessageOtherUser}>{message.message}</Text>
                            <Text style={styles.txtDateOtherUser}> {message.timestamp} </Text>                                                        
                        </View>                                                
                        { senderProfile.image ? (
                            <Image
                                style={styles.photoOtherUser}
                                resizeMode='cover'
                                source={{ uri : senderProfile.image}}
                            />
                        ) : (
                            <View style={[styles.photoOtherUser, {justifyContent:"center", alignItems: "center", borderRadius: 30, borderWidth: 2, borderColor: COLORS.White, backgroundColor: COLORS.primary_500 }]}>
                                <Text style={{fontWeight:"bold", fontSize:FONTSIZE.size_14, color: COLORS.White}} >                        
                                    {senderProfile.nom.charAt(0).toUpperCase() + senderProfile.prenom.charAt(0).toUpperCase()}
                                </Text>
                            </View>

                        )
                        }     
                    </TouchableOpacity>     
                    </View>  
                )
            }

        </View>
    );
}
const styles = StyleSheet.create({
    containerOtherUser: {        
        padding: 8,
        paddingTop: 10,
        paddingStart:20,
        borderRadius: 5,
        backgroundColor: COLORS.primary_50,
        alignSelf: "flex-start"
    }, 
    photoOtherUser: {
        width: 30, 
        height: 30, 
        borderRadius:40,
        position : 'absolute',        
        left: 1,          
    }, 
    txtDateOtherUser: {
        fontSize: FONTSIZE.size_10,
        textAlign: 'right',
        marginTop:5
    },
    txtMessageOtherUser: {
        fontSize: FONTSIZE.size_14
    }, 
    txtUserOtherUser: {
        fontWeight: "bold",
        fontSize: FONTSIZE.size_14,                 
        textAlign: "left",
        paddingStart: 40                
    },




    
    containercCurrentUser: {           
        padding: 8,
        paddingEnd:40,
        borderRadius: 5,       
        backgroundColor: COLORS.primary_50,
        alignSelf: "flex-end"
    }, 
    photoCurrentUser: {
        width: 30, 
        height: 30, 
        borderRadius:40,
        position : 'absolute',
        top: 5,
        right: 1
    }, 
    txtDate: {
        fontSize: FONTSIZE.size_10,
        textAlign: 'left',
        marginTop:5
    },
    txtMessage: {
        fontSize: FONTSIZE.size_14
    }, 
    txtUser: {
        fontWeight: "bold",
        fontSize: FONTSIZE.size_14,                 
        textAlign: "right",
        paddingEnd: 30                
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
        justifyContent: "flex-end", 
        
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

