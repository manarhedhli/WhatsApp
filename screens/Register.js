import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, {  useState } from 'react'
import globalStyles from '../styles/GlobalStyles'
import Logo from '../components/Logo'
import { COLORS, FONTSIZE } from '../styles/Theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from '../config'


export default function Register(props) {

  const auth = firebase.auth();
 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState("")

 
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  const handleCheckboxToggle = () => {
    setIsChecked(!isChecked);
  };
  const handleRegister = () => {
    if (email === "" ||password === "" || confirmPassword === ""){
      setErrorMsg("Please fill in all the fields")
    } else if (!isChecked) {
      setErrorMsg("You must accept Our conditions!")
    }
    else if (password !== confirmPassword){
      setErrorMsg("Password and Confirm password must mutch!")
    } 
    else if (password === confirmPassword){
      auth.createUserWithEmailAndPassword(email, password)
      .then(()=>{   
        Alert.alert(
          'Account Created!',
          'Your account has been successfully created. Welcome to the community!',
          [
            {
              text: 'Okay',
              onPress: () => {                
                props.navigation.navigate('Login');
              },
            },
          ]
        );   
      })
      .catch((err)=>{
        setErrorMsg(err.message )        
      })      
    } 
  }

  return (
    <KeyboardAvoidingView      
      style={globalStyles.container}
    >
      <Logo/>
      <View style= {styles.titleContainer}>
        <Text style= {styles.title}>Create an account</Text>
      </View>
      <ScrollView 
        showsVerticalScrollIndicator={false}
      >   
      <View style={globalStyles.errorContainer}>
        <Text style={globalStyles.txtError} > {errorMsg} </Text>
      </View>

        <TextInput
            value={email}
            onChangeText={(text) => { setEmail(text) ; setErrorMsg("") }}                  
            style={globalStyles.textInput}
            placeholder='Username'
        />
        <View style={styles.inputContainer}>
        
          <TextInput
            value= {password}
            onChangeText={(text) => { setPassword(text) ; setErrorMsg("") }}          
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

        <View style={styles.inputContainer}>
        
          <TextInput
            value= {confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text) ; setErrorMsg("") }}             
            style={globalStyles.textInput}
            placeholder='Confirm password'
            secureTextEntry={!isConfirmPasswordVisible}
          />
          <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
            <Icon
              name={isConfirmPasswordVisible ? 'eye' : 'eye-slash'}
              size={24}
              color='black'
            />
          </TouchableOpacity>
      
        </View>

        <TouchableOpacity style={{flexDirection: "row", marginVertical: 10}} onPress={handleCheckboxToggle}>
          <View style={[styles.checkbox, isChecked ? styles.checked : null]}>
            <View style={{ borderWidth: 2, borderColor: COLORS.text_200, width: 25, height: 25, backgroundColor: isChecked ? COLORS.brand : COLORS.text_50, borderRadius: 8 }}></View>
          </View>
          <Text style={{fontSize: FONTSIZE.size_18, marginStart: 10}}>I accept the condition</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.btn,{width: "%100", marginTop:50}]}
          onPress={handleRegister}
        >
          {!isLoading ? (
              <Text style={globalStyles.txtBtn}>Sign Up</Text>
            ): (
              <ActivityIndicator size="small" color= {COLORS.primary_50}></ActivityIndicator>
            ) 
          } 
        </TouchableOpacity>
                  
        <TouchableOpacity
          onPress={() => props.navigation.replace('Login')}
          style={{ alignItems: "flex-end", justifyContent: "flex-end", marginTop: 40 }}
        >
          <Text style={styles.txtLink}>You already have an account ?</Text>
        </TouchableOpacity>
      
    {/* </View> */}
    </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center", 
    justifyContent: "center",
    marginBottom: 30
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