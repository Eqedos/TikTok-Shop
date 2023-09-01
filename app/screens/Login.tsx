import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
      setLoading(true);
      try {
          await signInWithEmailAndPassword(FIREBASE_AUTH,email, password);
          console.log('Successfully signed in');
          // Navigate to another screen or update state here if needed
      } catch (error) {
          console.error('Error signing in:', error);
          // Handle errors (e.g., show an error message to the user) here if needed
      }
      setLoading(false);
  };
  
  const signUp = async () => {
      setLoading(true);
      try {
          await createUserWithEmailAndPassword(FIREBASE_AUTH,email, password);
          console.log('Successfully signed up');
          // Navigate to another screen or update state here if needed
      } catch (error) {
          console.error('Error signing up:', error);
          // Handle errors (e.g., show an error message to the user) here if needed
      }
      setLoading(false);
  };
  

  return (
    <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            onChangeText={text => setEmail(text)}
            value={email}
        />
        <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            onChangeText={text => setPassword(text)}
            value={password}
        />
        {loading ? (
            <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
          <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={signUp}>
              <Text style={styles.buttonTextOutline}>Sign Up</Text>
          </TouchableOpacity>
      </>
        )}
    </View>
);
}

export default Login;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      backgroundColor: '#000',
  },
  title: {
      fontSize: 28,
      marginBottom: 30,
      textAlign: 'center',
      color: '#fff',
  },
  input: {
      height: 50,
      borderColor: '#333',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 15,
      color: '#fff',
      borderRadius: 5,
      backgroundColor: 'rgba(255,255,255,0.1)',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
},
buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: 'bold'
},
buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
},
buttonTextOutline: {
    color: "#fff",
    fontSize: 16,
    fontWeight: 'bold'
},
});