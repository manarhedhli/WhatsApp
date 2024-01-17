import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileImage from './ProfileImage';
import { COLORS, FONTSIZE } from '../styles/Theme';

const ItemProfile = ({ profile, openDialog, navigation }) => (
    <View style={styles.ItemProfilecontainer}>
        <TouchableOpacity style={{width: "10%"}} onPress={() => openDialog(profile)}>  
            <ProfileImage size={45} profile={profile}/>                        
            {profile.isOnLine && (<View style={{position: "absolute", top:30, left:20, borderWidth:2, borderColor: COLORS.White, width: 15, height: 15, backgroundColor: COLORS.success_500, borderRadius: 10, marginLeft: 10}}/>            )}                
        </TouchableOpacity>
        <Text style={{ width: "60%", fontSize: FONTSIZE.size_16}}>
            {profile.nom} {profile.prenom}
        </Text>
        <View style={{ width: "10%"}}>
            <TouchableOpacity                 
                onPress={()=>{navigation.navigate('Chat', { profile: profile });}}
                style={styles.btn}
            >
                <Image                    
                    resizeMode='cover'
                    style= {{width:40, height: 40}}
                    source={require('../assets/images/icon_chat.png')}
                />
            </TouchableOpacity>                
        </View>
    </View>
  );
export default ItemProfile;


const styles = StyleSheet.create({
    ItemProfilecontainer: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between",        
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primary_50,
        height: 60, 
        borderRadius: 8, 
        padding: 10, 
        marginBottom:10,    
    },
    btn: {
        width: 40,
        height: 40,                
    }, 
    photo: {
        width: 45, 
        height:45, 
        borderRadius:45,        
    }
})