import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';


const RemoveUserScreen = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEid, setSelectedEid] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);
  const [refreshPage, setRefreshPage] = useState(false);
  const apiBaseUrl = config.API_BASE_URL;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await fetch(apiBaseUrl+'/get_employees', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setEmployeeData(data);
          } else {
            console.error('Error fetching employee data:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
    };

    fetchEmployeeData();
  }, [refreshPage]);

  const handleDeleteUser = (eid) => {
    setSelectedEid(eid);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    setIsModalVisible(false);

    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(apiBaseUrl+`/remove_user?eid=${selectedEid}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('User deleted successfully');
        setRefreshPage(true);
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const closeModal = () => {
    setSelectedEid(null);
    setIsModalVisible(false);
  };

  const toggleSearchBar = () => {
    setSearchBarVisible(!isSearchBarVisible);
  };

  const filterEmployees = (employee) => {
    return searchQuery === '' || employee.emp_Name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>REMOVE USER</Text>
      <TouchableOpacity onPress={toggleSearchBar} style={styles.searchIcon}>
        <Image source={require('../assets/search.png')} style={styles.iconImage} />
      </TouchableOpacity>

      {isSearchBarVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search employees..."
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
      )}

      <ScrollView>
        {employeeData
          .filter(filterEmployees)
          .map((employee) => (
            <View key={employee.eid} style={styles.feedItem}>
              <View style={styles.feedHeader}>
                <View style={styles.profilePictureContainer}>
                  {/* Conditionally render the profile picture based on API data */}
                  <Image
                    source={
                      employee.image
                        ? { uri: apiBaseUrlImage+`/${employee.image}` }
                        : require('../assets/user.png')
                    }
                    style={styles.profilePicture}
                  />
                </View>
                <Text style={styles.employeeName}>{employee.emp_Name}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(employee.eid)}
                >
                  <Image source={require('../assets/delete.png')} style={styles.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>Are you sure you want to permanently delete this user?</Text>
          <TouchableOpacity style={styles.modalButton} onPress={confirmDelete}>
            <Text style={styles.modalButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  iconImage: {
    width: 25,
    height: 25,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  feedItem: {
    marginBottom: 20,
  },
  feedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 8,
  },
  profilePictureContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'gray',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  employeeName: {
    flex: 1,
    fontSize: 18,
    marginRight: 10,
  },
  deleteButton: {
    width: 30,
    height: 30,
    backgroundColor: 'crimson',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 15,
    height: 15,
    tintColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'crimson',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: 90,
    borderRadius: 8,
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default RemoveUserScreen;
