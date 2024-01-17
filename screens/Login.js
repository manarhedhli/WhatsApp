import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useContext, useState } from 'react'
import globalStyles from '../styles/GlobalStyles'
import Logo from '../components/Logo'
import { COLORS, FONTSIZE } from '../styles/Theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../config'
import { AuthContext } from '../context/AuthProvider'
import { updateOnlineStatus } from '../config/Auth';
import { ScrollView } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'




export default function Login(props) {

  const auth = firebase.auth();
  const database = firebase.database();
  const authContext = useContext(AuthContext);  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState("")

  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const handleLogin = async () => {
    setIsLoading(true)
    if (email === "" || password === "") {
      setErrorMsg("Please fill in all the fields");
      setIsLoading(false)
    } else {
      try {      
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const uid_ = userCredential.user.uid;
        const email_ = userCredential.user.email;        
        authContext.login(uid_, email_);  // for new user essentially
        updateOnlineStatus(uid_, true)   
        
        const ref_profils = database.ref("Profils");  // for old user 
        const ref_profile = ref_profils.child(uid_);
        ref_profile.once('value', (snapshot) => {
          const data = snapshot.val();                    
          if (data) {
            const fName = data.nom;
            const lName = data.prenom;
            const phone = data.phone;
            const uri = data.image;
            authContext.setProfile(uri, fName, lName, phone);                         
          } else {
            console.log('No profile data found');
          }
        });
      } catch (err) {
        console.log(err);
        setIsLoading(false)
        setErrorMsg('Please check your credentials');
      }
    }
  };
  
  return (
    
    <KeyboardAvoidingView      
      style={globalStyles.container}
    >
      <Logo/>
      <View style= {styles.titleContainer}>
        <Text style= {styles.title}>Welcome back</Text>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.errorContainer}>
          <Text style={globalStyles.txtError} > {errorMsg} </Text>
        </View>
        <TextInput
            onChangeText={(text) => { setEmail(text) ; setErrorMsg("") }}
            style={globalStyles.textInput}
            placeholder='Username'
        />
        <View style={styles.inputContainer}>
        
          <TextInput
            onChangeText={(text) => {setPassword(text) ; setErrorMsg("")}}
            style={globalStyles.textInput}
            placeholder='Password'
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
            <Icon
              name={isPasswordVisible ? 'eye' : 'eye-slash'}
              size={24}
              color='black'
            />
          </TouchableOpacity>
      
      </View>        
        <TouchableOpacity
          style={[globalStyles.btn,{width: "%100"}]}
          onPress={handleLogin}
        >
          {
            !isLoading ? (
              <Text style={globalStyles.txtBtn}>Sign In</Text>
            ): (
              <ActivityIndicator size="small" color= {COLORS.primary_50}></ActivityIndicator>
            )            
          }
        </TouchableOpacity>
                  
        <TouchableOpacity
          onPress={() => props.navigation.replace('Register')}
          style={{ alignItems: "flex-end", justifyContent: "flex-end", marginTop: 60 }}
        >
          <Text style={styles.txtLink}>You don't have an account ?</Text>
        </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center", 
    justifyContent: "center",
    marginBottom: 50
  },
  title: {
    fontSize: 40,
    color: COLORS.primary_500,
    fontWeight: "bold", 

  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',    
  },
  eyeIcon: {
    position: "absolute",
    position: 'absolute',
    top: 15, 
    right: 25,
  },
  txtLink: {
    fontSize: FONTSIZE.size_18,
    color: COLORS.text_500, 
    padding: 10

  }
});
