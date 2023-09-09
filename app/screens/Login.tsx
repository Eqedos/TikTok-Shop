import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Login"
>;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log("Successfully signed in");
      navigation.navigate("Products"); // Navigate to Products screen
    } catch (error) {
      console.error("Error signing in:", error);
      setError("Invalid email or password"); // Set the error message
    }
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      console.log("Successfully signed up");
      navigation.navigate("Products"); // Navigate to Products screen
    } catch (error) {
      console.error("Error signing up:", error);
      setError("Account already exists"); // Set the error message
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/tiktok-shop-logo.png")}
          style={styles.logo}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        style={[styles.input, styles.inputWithMargin]}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={signUp}
          >
            <Text style={styles.buttonTextOutline}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
      {error !== "" && <Text style={styles.errorMessage}>{error}</Text>}
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#000",
  },
  input: {
    height: 50,
    borderColor: "#333",
    borderWidth: 1,
    marginBottom: 0,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    color: "#fff",
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  inputWithMargin: {
    marginBottom: 70, // Add more margin for the second TextInput
  },
  button: {
    marginBottom: 0,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
  },
  buttonTextOutline: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoContainer: {
    marginBottom: 20, // Add spacing between the logo and text
    alignItems: "center",
  },
  logo: {
    width: 175, // Set the desired width of the logo
    height: 175, // Set the desired height of the logo
    resizeMode: "contain", // Adjust the resizeMode as needed
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
});
