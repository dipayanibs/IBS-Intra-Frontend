import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 
    const navigation = useNavigation();
    const apiBaseUrl = config.API_BASE_URL;


    const handleLogin = async () => {
        const apiUrl = apiBaseUrl+'/login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const responseBody = await response.json();

            if (response.ok && responseBody.token) {
                // Store token, role, and eid securely in AsyncStorage
                await AsyncStorage.setItem('token', responseBody.token);
                await AsyncStorage.setItem('role', responseBody.role);
                await AsyncStorage.setItem('eid', String(responseBody.eid));

                console.log('Login successful');
                navigation.navigate('Home');
            } else if (responseBody.message) {
                const errorMessage = responseBody.message;
                setErrorMessage(errorMessage); // Set error message state
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred. Please try again.'); // Set a generic error message
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.loginLabel}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Employee ID"
                value={username}
                onChangeText={text => setUsername(text)}
                placeholderTextColor="#888"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={text => setPassword(text)}
                placeholderTextColor="#888"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    loginButton: {
        backgroundColor: 'black',
        width: '80%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorMessage: {
        color: 'red',
        marginTop: 10,
    },
});

export default Login;
