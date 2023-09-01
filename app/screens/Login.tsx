import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ActivityIndicator } from 'react-native';
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
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={text => setPassword(text)}
                value={password}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Button title="Sign In" onPress={signIn} />
                    <Button title="Sign Up" onPress={signUp} />
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
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
});
