import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput, Picker } from 'react-native';
import config from '../config';
import DatePicker from 'react-native-datepicker';

const AddUserScreen = () => {
    const [empEID, setEmpEID] = useState('');
    const [empName, setEmpName] = useState('');
    const [role, setRole] = useState('Admin');
    // const [doj, setDoj] = useState(new Date());
    // const [dob, setDob] = useState(new Date());
    const [nickName, setNickName] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [linkedIn, setLinkedIn] = useState('');
    const [pMail, setPMail] = useState('');
    const [wMail, setWMail] = useState('');
    const [password, setPassword] = useState('');
    const [eventstartDate, setEventstartDate] = useState('');

    const [eventendDate, setEventendDate] = useState('');
    const apiBaseUrl = config.API_BASE_URL;

    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState(null);
    const setSecondsToZero = (dateTimeString) => {

        const date = new Date(dateTimeString);
    
        date.setSeconds(0); 
    
        console.log(date);
    
        isoString = formatDate(date);
    
        console.log(isoString);
    
    
        return isoString;
    
      };

      const formatDate = (date) => {

        const year = date.getFullYear();
    
        const month = String(date.getMonth() + 1).padStart(2, '0');
    
        const day = String(date.getDate()).padStart(2, '0');
    
    
     
    
        return `${year}-${month}-${day}`;
    
      };

      const handleStartDateChange = (date) => {

        console.log(toString(date));
    
        setEventstartDate(date);
    
       
    
      };
    
     
    
      const handleEndDateChange = (date) => {
    
        console.log(date);
    
        setEventendDate(date);
    
       
    
      };

    const handleAddUser = async () => {
        const token = await AsyncStorage.getItem('token');
        const eid = await AsyncStorage.getItem('eid');


        const userData = {
            eid: empEID,
            emp_Name: empName,
            role: role,
            doj: eventstartDate,
            dob: eventendDate,
            nick_Name: nickName || 'Add Nick Name',
            whatsApp: whatsApp || 'Add Whatsap Link',
            linkedIn: linkedIn || 'Add LinkedIn Link',
            pMail: pMail || 'Add Personal Mail',
            wMail: wMail || 'Add Work Mail',
            password: password
        };

        try {
            console.log(userData.doj);
            console.log(userData.dob)
            const response = await fetch(apiBaseUrl+'/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                setModalVisible(true);
                setEmpName('');
                setRole('Admin');
                setEventendDate(new Date());
                setEventendDate(new Date());
                setNickName('');
                setWhatsApp('');
                setLinkedIn('');
                setPMail('');
                setWMail('');
                setPassword('');
            } else {
                setError(data.message || 'An error occurred while adding the user.');
                
                const responseData = await console.log(response.json());
                console.log(responseData);
                
            }
        } catch (error) {
            setError('An error occurred while adding the user.');
            console.log(error);
            console.log(response.error);

        }
    };

    useEffect(() => {
        setError(null);
    }, [empName, role, eventendDate.eventstartDate, nickName, whatsApp, linkedIn, pMail, wMail, password]);

    return (
        <ScrollView style={{ backgroundColor: 'lightblue', padding: 20 }}>
            <View style={styles.container}>
                <Text style={styles.addUserLabel}>Add User</Text>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Employee Eid:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter employee Eid"
                        value={empEID}
                        onChangeText={setEmpEID}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Employee Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter employee name"
                        value={empName}
                        onChangeText={setEmpName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Role:</Text>
                    <Picker
                        selectedValue={role}
                        onValueChange={(itemValue) => setRole(itemValue)}
                        style={styles.input}
                    >
                        <Picker.Item label="Admin" value="Admin" />
                        <Picker.Item label="User" value="User" />
                        <Picker.Item label="Executive" value="Executive" />
                    </Picker>
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Date of Joining:</Text>
                    <input
                        type="date"
                        value={eventstartDate}
                        onChange={(e) => handleStartDateChange(setSecondsToZero(e.target.value))}
                        style={styles.input}
                        placeholder="Start date"
                        />
                </View>

                <View style={styles.inputRow}>
                <Text style={styles.fieldLabel}>Date of Birth:</Text>
                <input
                type="date"
                value={eventendDate}
                onChange={(e) => handleEndDateChange(setSecondsToZero(e.target.value))}
                style={styles.input}
                placeholder="End date"
                />
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Nick Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter nick name (optional)"
                        value={nickName}
                        onChangeText={setNickName}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>WhatsApp:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter WhatsApp (optional)"
                        value={whatsApp}
                        onChangeText={setWhatsApp}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>LinkedIn:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter LinkedIn (optional)"
                        value={linkedIn}
                        onChangeText={setLinkedIn}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Personal Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter personal email (optional)"
                        value={pMail}
                        onChangeText={setPMail}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Work Email:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter work email (optional)"
                        value={wMail}
                        onChangeText={setWMail}
                    />
                </View>
                <View style={styles.inputRow}>
                    <Text style={styles.fieldLabel}>Password:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
                    <Text style={styles.addButtonText}>Add User</Text>
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>User Added Successfully!</Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'left',
        // paddingBottom: 20,
        padding:15,
        paddingTop:0,
    },
    addUserLabel: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    fieldLabel: {
        width:200,
        fontWeight: 'bold',
        marginRight: 10,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        backgroundColor:'lightblue',
        flex: 1,
        height: 40,
        minWidth:185,
        //width:150,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    // addButton: {
    //     backgroundColor: 'lightgrey',
    //     padding: 10,
    //     borderRadius: 5,
    //     marginTop: 10,
    // },
    addButtonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius:12,
        padding: 10,
        backgroundColor: '#228b22',
        marginTop:15,
        color:'white',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtonText:{
        color:'white',
        textAlign: 'center',
        fontSize: 20,
    },
    modalButton: {
        textAlign: 'center',
        fontWeight: 'bold',
        borderRadius:12,
        padding: 8,
        minWidth:80,
        backgroundColor: '#228b22',
        marginTop:15,
        // modalButtonText:{
        //     color:'white',
        // },
        },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default AddUserScreen;
