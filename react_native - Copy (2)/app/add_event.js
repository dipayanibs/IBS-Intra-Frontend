// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   StyleSheet,
//   Text,
//   TextInput,
//   Button,
//   Alert,
//   Modal,
//   ScrollView,
//   TouchableOpacity,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import CheckBox from 'react-native-checkbox-component';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AddEvent = () => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [participants, setParticipants] = useState([]);
//   const [selectedParticipants, setSelectedParticipants] = useState([]);
//   const [selectAll, setSelectAll] = useState(true);
//   const [token, setToken] = useState('');
//   const [eventstartDate, setEventstartDate] = useState(new Date());
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [eventendDate, setEventendDate] = useState(new Date());
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isDropdownVisible, setIsDropdownVisible] = useState(false);
//   const [selectedParticipantsNames, setSelectedParticipantsNames] = useState([]);

//   const setSecondsToZero = (dateTimeString) => {
//     const date = new Date(dateTimeString);
//     date.setSeconds(0);
//     const isoString = formatDate(date);
//     return isoString;
//   };

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0');
//     const day = String(date.getDate()).padStart(2, '0');
//     const hours = String(date.getHours()).padStart(2, '0');
//     const minutes = String(date.getMinutes()).padStart(2, '0');
//     return `${year}-${month}-${day}T${hours}:${minutes}:00.000`;
//   };

//   const handleStartDateChange = (event, selectedDate) => {
//     setShowStartDatePicker(false);
//     if (selectedDate) {
//       setEventstartDate(selectedDate);
//     }
//   };

//   useEffect(() => {
//     AsyncStorage.multiGet(['token', 'role', 'eid'])
//       .then((values) => {
//         const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;

//         if (token && eid) {
//           console.log('Token:', token);
//           console.log('EID:', eid);
//           //fetchUserData(eid, token); // Fetch user data using the token and eid
//         }
//       })
//       .catch((error) => {
//         console.error('Error getting values:', error);
//       });
//   }, []);

//   const handleEndDateChange = (event, selectedDate) => {
//     setShowEndDatePicker(false);
//     if (selectedDate) {
//       setEventendDate(selectedDate);
//     }
//   };

//   const fetchEmployeeNames = async () => {
//     try {
//       const storedToken = await AsyncStorage.getItem('token');
//       setToken(storedToken);
//       const storedEid = await AsyncStorage.getItem('eid');
//       const currentUserEid = parseInt(storedEid, 10);
  
//       const response = await fetch('https://social.intreax.com/App/get_employees', {
//         method: 'GET',
//         headers: {
//           Authorization: `Bearer ${storedToken}`,
//           'Content-Type': 'application/json',
//         },
//         timeout: 10000,
//       });
  
//       if (response.ok) {
//         const employeeData = await response.json();
//         const employeeNames = employeeData
//           .filter((employee) => employee.eid !== currentUserEid)
//           .map((employee) => ({
//             key: employee.eid,
//             label: employee.emp_Name,
//             checked: true,
//           }));
  
//         const initialSelectedParticipants = employeeNames.map((participant) => participant.key);
  
//         setParticipants(employeeNames);
//         setSelectedParticipants(initialSelectedParticipants);
//       } else {
//         console.error('Failed to fetch employee names. Response status:', response.status);
//       }
//     } catch (error) {
//       console.error('Error fetching employee names:', error);
//     }
//   };

//   const handleSelectAll = (value) => {
//     setSelectAll(value);
//     const updatedParticipants = participants.map((participant) => ({
//       ...participant,
//       checked: value,
//     }));
//     setParticipants(updatedParticipants);
//     const selectedIds = value ? participants.map((p) => p.key) : [];
//     setSelectedParticipants(selectedIds);
//     const selectedNames = value ? participants.map((p) => p.label) : [];
//     setSelectedParticipantsNames(selectedNames);
//   };

//   const handleParticipantToggle = (participantKey) => {
//     const updatedParticipants = participants.map((participant) =>
//       participant.key === participantKey ? { ...participant, checked: !participant.checked } : participant
//     );

//     setParticipants(updatedParticipants);

//     const selectedIds = updatedParticipants
//       .filter((participant) => participant.checked)
//       .map((p) => p.key);
//     setSelectedParticipants(selectedIds);

//     setSelectAll(
//       updatedParticipants.every((participant) => participant.checked) &&
//       updatedParticipants.length > 0
//     );
//   };

//   const handleAddEvent = async () => {
//     try {
//       const selectedEmployees = participants.filter((participant) =>
//         selectedParticipants.includes(participant.key)
//       );

//       const eventParticipantIds = selectedEmployees.map((employee) => employee.key.toString());
//       console.log('Eids Being Passed:', eventParticipantIds);

//       const eventData = {
//         title,
//         start_Date: setSecondsToZero(eventstartDate),
//         end_Date: setSecondsToZero(eventendDate),
//         description,
//         event_participants: eventParticipantIds,
//         event_participants_names: selectedParticipantsNames,
//       };

//       const response = await fetch('https://social.intreax.com/App/add_event', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(eventData),
//       });

//       if (response.ok) {
//         setShowSuccessModal(true);
//         clearForm();
//       } else {
//         console.error('Failed to add event');
//         console.log(response);
//       }
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', 'An error occurred');
//     }
//   };

//   const clearForm = () => {
//     setTitle('');
//     setDescription('');
//     setSelectedParticipants([]);
//     setEventstartDate(new Date());
//     setEventendDate(new Date());
//   };

//   useEffect(() => {
//     fetchEmployeeNames();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <TextInput
//         label="Title"
//         placeholder="Enter title"
//         value={title}
//         onChangeText={setTitle}
//         style={[styles.input, { backgroundColor: 'lightgray' }]}
//         multiline
//       />

//       {/* Start Date */}
//       <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
//         <Text style={styles.label}>Start Date</Text>
//         <View style={styles.datePickerContainer}>
//           <Text>{eventstartDate.toLocaleDateString()}</Text>
//           <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
//             <Text>📅</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setShowStartDatePicker(true)}>
//             <Text>🕒</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//       {showStartDatePicker && (
//         <DateTimePicker
//           value={eventstartDate}
//           mode="datetime"
//           is24Hour={true}
//           display="default"
//           onChange={handleStartDateChange}
//         />
//       )}

//       {/* End Date */}
//       <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
//         <Text style={styles.label}>End Date</Text>
//         <View style={styles.datePickerContainer}>
//           <Text>{eventendDate.toLocaleDateString()}</Text>
//           <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
//             <Text>📅</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
//             <Text>🕒</Text>
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//       {showEndDatePicker && (
//         <DateTimePicker
//           value={eventendDate}
//           mode="datetime"
//           is24Hour={true}
//           display="default"
//           onChange={handleEndDateChange}
//         />
//       )}

//       <TextInput
//         label="Description"
//         placeholder="Enter description"
//         value={description}
//         onChangeText={setDescription}
//         style={[styles.input, { backgroundColor: 'lightgray' }]}
//         multiline
//       />

//       <Text>Select Participants:</Text>
//       <View style={styles.selectAllContainer}>
//         <CheckBox
//           label="Select All"
//           checked={selectAll}
//           onPress={() => handleSelectAll(!selectAll)}
//         />
//       </View>

//       <TouchableOpacity
//         onPress={() => setIsDropdownVisible(!isDropdownVisible)}
//         style={styles.dropdownButton}
//       >
//         <Text>Select Participants</Text>
//         <Text>{isDropdownVisible ? '▲' : '▼'}</Text>
//       </TouchableOpacity>

//       {isDropdownVisible && (
//         <ScrollView style={styles.dropdownList}>
//           {participants.map((participant) => (
//             <View key={participant.key} style={styles.participantContainer}>
//               <CheckBox
//                 label={participant.label}
//                 checked={participant.checked}
//                 onPress={() => handleParticipantToggle(participant.key)}
//               />
//               <Text>{participant.label}</Text>
//             </View>
//           ))}
//         </ScrollView>
//       )}

//       <View style={styles.buttonContainer}>
//         <Button
//           title="Send for Approval"
//           onPress={handleAddEvent}
//           color="white"
//         />
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showSuccessModal}
//         onRequestClose={() => {
//           setShowSuccessModal(false);
//         }}
//       >
//         <View style={styles.modalView}>
//           <Text>Event Successfully sent for approval</Text>
//           <Button
//             title="Close"
//             onPress={() => {
//               setShowSuccessModal(false);
//             }}
//           />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: 'white',
//   },

//   input: {
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: 'gray',
//     borderRadius: 5,
//     padding: 10,
//   },

//   selectAllContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   participantContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   buttonContainer: {
//     backgroundColor: 'green',
//     marginTop: 16,
//     borderRadius: 25,
//     overflow: 'hidden',
//     marginBottom: 16,
//   },

//   modalView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//   },

//   dropdownButton: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: 'lightgray',
//     padding: 10,
//     borderRadius: 5,
//   },

//   dropdownList: {
//     maxHeight: 150,
//     overflowY: 'auto',
//   },

//   label: {
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },

//   datePickerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });

// export default AddEvent;
