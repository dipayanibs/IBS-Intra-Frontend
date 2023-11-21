import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';


 

const ChangeNickname = () => {

  const [token, setToken] = useState('');
  const [nickName, setNickName] = useState('');
  const [newNickName, setNewNickName] = useState('');
  const apiBaseUrl = config.API_BASE_URL;



 

  useEffect(() => {

    AsyncStorage.multiGet(['token', 'role', 'eid'])

      .then(values => {

        const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;

        if (token) {

            setToken(token);

          // Fetch user profile data using the token

          axios.get(apiBaseUrl+`/profile?eid=${eid}`, {

            headers: {

              Authorization: `Bearer ${token}`,

            },

          })

          .then(response => {

            setNickName(response.data.emp_profile[0].nick_Name);

          })

          .catch(error => {

            console.error('Error fetching profile:', error);

          });

        }

      })

      .catch(error => {

        console.error('Error getting values:', error);

      });

  }, []);

 ;

 

  const updateNickName = () => {


    fetch(apiBaseUrl+'/edit_profile', {

      method: 'POST',

      headers: {

        'Content-Type': 'application/json',

        Authorization: `Bearer ${token}`,

      },

      body: JSON.stringify({

        nick_Name: newNickName,

      }),

    })

      .then((response) => response.json())

      .then((data) => {

        if (data.success) {

          setNewNickName('');

        }

      })

      .catch((error) => console.error(error));


  };

 

  return (

    <View style={styles.container}>

        <Text style={styles.title}>Change Nickname</Text>

    <View>

      <TextInput

      style={styles.input}
        placeholder={` ${nickName}`}
        value={newNickName}
        onChangeText={(text) => setNewNickName(text)}
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.button} onPress={updateNickName}>

        <Text style={styles.buttonText}>Update</Text>

      </TouchableOpacity>

    </View>

    </View>

  );

};

 

 

const styles = StyleSheet.create({

    container: {

        flex: 1,

        justifyContent: 'center',

        alignItems: 'center',

        padding: 20,

      },

 

      title: {

        fontSize: 24,

        fontWeight: 'bold',

        marginBottom: 20,

      },

 

      input: {

        width: 200,

        height: 40,

        borderColor: 'gray',

        borderWidth: 1,

        borderRadius: 5,

        paddingHorizontal: 10,

        marginBottom: 20,

 

      },

 

      button: {

        backgroundColor: 'blue',

        paddingVertical: 10,

        paddingHorizontal: 20,

        borderRadius: 5,

 

      },

 

      buttonText: {

        color: 'white',

        fontSize: 16,

        textAlign: 'center',

 

      },

 

      modalContainer: {

        flex: 1,

        justifyContent: 'center',

        alignItems: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)',

 

      },

 

      modalContent: {

        backgroundColor: 'white',

        padding: 20,

        borderRadius: 10,

        alignItems: 'center',

 

      },

 

      modalText: {

        fontSize: 18,

        marginBottom: 20,

        textAlign: 'center',

 

      },

 

      modalButton: {

        backgroundColor: 'blue',

        paddingVertical: 10,

        paddingHorizontal: 20,

        borderRadius: 5,

 

      },

 

      modalButtonText: {

        color: 'white',

        fontSize: 16,

        textAlign: 'center',

 

      },

 

 

});

 

 

 

export default ChangeNickname;

 