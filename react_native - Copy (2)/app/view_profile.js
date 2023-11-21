import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import config from '../config';


const ViewProfileScreen = () => {
  const [profileData, setProfileData] = useState({});
  const [imageSource, setImageSource] = useState(require('../assets/profile_picture.jpg'));
  const [formattedDOB, setFormattedDOB] = useState('');
  const [formattedDOJ, setFormattedDOJ] = useState('');
  const apiBaseUrl = config.API_BASE_URL;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;

  const route = useRoute();
  const navigation = useNavigation();
  const eid = route.params?.eid;

  const navigateToChatScreen = () => {
    navigation.navigate('chat_screen');
  };

  // Function to format the date in "dd-mm-yyyy" format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then(token => {
        if (token) {
          axios
            .get(apiBaseUrl+`/profile?eid=${eid}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(response => {
              const profile = response.data.emp_profile[0];
              setProfileData(profile);

              // Format date of joining and birthday
              const formattedDOJ = formatDate(profile.doj);
              const formattedDOB = formatDate(profile.dob);

              // Check if the 'image' field in the profile data is not null
              if (profile.image) {
                // Use the remote image if it exists
                setImageSource({ uri: apiBaseUrlImage+`/${profile.image}` });
              }

              // Set the formatted dates in the state
              setFormattedDOJ(formattedDOJ);
              setFormattedDOB(formattedDOB);
            })
            .catch(error => {
              console.error('Error fetching profile:', error);
            });
        }
      })
      .catch(error => {
        console.error('Error getting token:', error);
      });
  }, [eid]);

  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        <Image source={require('../assets/IBSFINtech-logo.png')} style={styles.coverImage} />
        <View style={styles.line} />
        <Image source={imageSource} style={styles.profileImage} />      
      </View >
      <View style={styles.logoContainer}>
        {/* Render your logo buttons here */}
        {/* You can use TouchableOpacity with Image inside */}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Name: {profileData.emp_Name}</Text>
        <Text style={styles.email}>{profileData.wmail}</Text>
        <Text style={styles.infoText}>Employee ID: {profileData.eid}</Text>
        <Text style={styles.infoText}>Birthday: {formattedDOB}</Text>
        <Text style={styles.infoText}>Date of Joining: {formattedDOJ}</Text>
        <Text style={styles.infoText}>Nick Name: {profileData.nick_Name}</Text>
      </View>
      <View style={styles.chatButton}>
        <Button
          title="Start Chat"
          onPress={navigateToChatScreen}        
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  coverContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  profileImage: {
    position: 'absolute',
    bottom: -50,
    alignSelf: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'gray',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center',
    paddingTop:25,
    width: '100%',
  },
  infoText: {
    fontSize: 16,
    marginBottom: 10,
  },
  chatButton: {
    backgroundColor:'lightblue',
    borderRadius: 8,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'gray',
    marginBottom: 20,
  },
});

export default ViewProfileScreen;