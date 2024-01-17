import { View, Text } from 'react-native'
import React from 'react'

export default function JoinCall({navigation}) {
  return (
    <View>
      <Text>JoinCall</Text>
    </View>
  )
}


// import { View, Text, TouchableOpacity } from 'react-native'
// import React, { useState } from 'react'
// import { Image } from 'react-native';
// import { COLORS, FONTSIZE } from '../styles/Theme';






// export default function JoinCall({ navigation, route }) {

//     const secondUser = route.params.profile;
//     const [status, setStatus] = useState("Connecting ...")

    
    





//     return (
//         <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
//             <Image 
//                 style={{width: 150, height:150, borderRadius: 100}}                                 
//                 resizeMode='cover'
//                 source={{ uri : secondUser.image}}                
//             />
//             <Text
//                 style={{fontSize: FONTSIZE.size_24, fontWeight:"bold", marginTop:20}}
//             > 
//                 {secondUser.nom } {secondUser.prenom} 
//             </Text>
//             <Text>{secondUser.phone} </Text>
//             <Text 
//                 style={{color: COLORS.text_200, fontSize: FONTSIZE.size_14}}
//             >
//                 {status}
//             </Text>
//             <TouchableOpacity
//                 onPress={() => {                    
//                     navigation.replace("Friends");
//                   }}
//                 style={{marginTop:20, width: 50, height:50, borderRadius: 30, backgroundColor: "red", justifyContent:"center", alignItems:"center"}}
                
//             >
//                 <Image style={{ width:30, height: 30}} source={require('../assets/images/icon_call.png')} />                
//             </TouchableOpacity>
//             <TouchableOpacity
//                 onPress={() => {                    
//                     navigation.replace("Friends");
//                   }}
//                 style={{marginTop:20, width: 50, height:50, borderRadius: 30, backgroundColor: "red", justifyContent:"center", alignItems:"center"}}
                
//             >
//                 <Image style={{ width:30, height: 30}} source={require('../assets/images/icon_call.png')} />                
//             </TouchableOpacity>
//         </View>
//     )
// }