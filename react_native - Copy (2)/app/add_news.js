import React, { useState, useEffect } from 'react';
import {View, Text, TextInput, Button, StyleSheet, Modal, TouchableHighlight, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import config from '../config';

const AddNews = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Error modal
  const [successModalVisible, setSuccessModalVisible] = useState(false); // Success modal
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  //const [selectedImage, setSelectedImage] = useState(null);
  const apiBaseUrl = config.API_BASE_URL;
  const [imageSource, setImageSource] = useState(null);

  //const handlePickImage = async () => {
  //  try {
  //    const result = await ImagePicker.launchImageLibraryAsync({
  //      mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //      allowsEditing: true,
  //      aspect: [4, 3],
  //      quality: 1,
  //    });

   //   if (!result.canceled && result.assets.length > 0) {
    //    setSelectedImage(result.assets[0]);
   //   }
   // } catch (error) {
   //   console.error('ImagePicker Error:', error);
  //  }
  //};

  const handleSubmit = async () => {
    try {
      if (!title.trim()) {
        setErrorMessage('Title field cannot be empty');
        setModalVisible(true);
        return;
      }

      const token = await AsyncStorage.getItem('token');
      const eid = await AsyncStorage.getItem('eid');

      const formData = new FormData();
      formData.append('eid', eid);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('link', link);
      
      if (imageSource) {
        // You can add image handling here
        console.log(imageSource);
        formData.append('image', imageSource); // Modify this line for image upload
      }

      if (token && eid) {
        //const currentDate = new Date().toISOString();

        // const newsData = {
        //   id: eid,
        //   title,
        //   description,
        //   image: '',
        //   //p_Date: currentDate,
        //   link,
        // };

        const response = await fetch('https://social.intreax.com/App/add_news', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: formData,
        });

        if (response.ok) {
          setSuccessMessage('News added successfully');
          setSuccessModalVisible(true);
          setTitle('');
          setDescription('');
          setLink('');

        } else {
          console.error('Failed to add news');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // Request permission
      if (status !== 'granted') {
        console.log('Permission to access media library denied');
        return;
      }
  
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
  
      if (!result.canceled) {
        const temporaryUri = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
  
        // Write the image data to a temporary file
        await FileSystem.writeAsStringAsync(temporaryUri, result.base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
  
        // Create an IFormFile object
        const imageFile = {
          uri: temporaryUri,
          name: 'image.jpg', // You can specify a custom file name here
          type: 'image/jpeg', // You may need to adjust the MIME type based on your needs
        };
  
        // Now you can use `imageFile` as an IFormFile and send it to your API
        // Send the `imageFile` to your API using an HTTP request, e.g., a POST request
        // Example: const formData = new FormData();
        // formData.append('file', imageFile);
        // axios.post('your-api-endpoint', formData);
        
        setImageSource(imageFile); // Set the image source for display if needed
        console.log(imageSource);
      }
    } catch (error) {
      console.error('ImagePicker Error: ', error);
    }
  };
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work.');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.multiGet(['token', 'role', 'eid'])
      .then((values) => {
        const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;

        if (token) {
          console.log('Token:', token);
        }

        if (role) {
          console.log('Role:', role);
        }

        if (eid) {
          console.log('EID:', eid);
        }
      })
      .catch((error) => {
        console.error('Error getting values:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
      />
      <Text>Description:</Text>
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        multiline
        value={description}
        onChangeText={(text) => setDescription(text)}
      />
      <Text>Link:</Text>
      <TextInput
        style={styles.input}
        value={link}
        onChangeText={(text) => setLink(text)}
      />
      <View style={styles.blueButton}>
        <Button title="Add Image" 
        color="white"
        onPress={handleImagePicker} />
        {imageSource && (
            <Image
              source={imageSource}
              style={{ width: 100, height: 100 }}
            />
          )}
      </View>
      <View style={styles.greenButton}>
        <Button
          title="Submit"
          color="white"
          onPress={handleSubmit}        />
      </View>
      {/* Error Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{errorMessage}</Text>
            <TouchableHighlight
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Text style={styles.modalButton}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      {/* Success Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={successModalVisible}
        onRequestClose={() => {
          setSuccessModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{successMessage}</Text>
            <TouchableHighlight
              onPress={() => {
                setSuccessModalVisible(false);
              }}
            >
              <Text style={styles.modalButton}>OK</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    backgroundColor: '#EDEDED',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  descriptionInput: {
    height: 120,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalButton: {
    fontSize: 16,
    color: 'blue',
  },
  blueButton: {
    backgroundColor: 'blue',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
  greenButton: {
    backgroundColor: 'green',
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 16,
  },
});

export default AddNews;
