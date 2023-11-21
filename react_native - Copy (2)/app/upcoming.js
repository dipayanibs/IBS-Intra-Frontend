import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';



const UpcomingScreen = () => {

    const [feedData, setFeedData] = useState([]);
    const apiBaseUrl = config.API_BASE_URL;



    const handleLinkPress = (item) => {
        const url = item.news?.link;
      
        if (url) {
          if (!url.startsWith('http://') && !url.startsWith('https://')) {
            const absoluteUrl = `http://${url}`;
            Linking.openURL(absoluteUrl)
              .then(() => console.log('URL opened successfully'))
              .catch((err) => console.error('An error occurred while opening the link: ', err));
          } else {
            Linking.openURL(url)
              .then(() => console.log('URL opened successfully'))
              .catch((err) => console.error('An error occurred while opening the link: ', err));
          }
        }
      };


    useEffect(() => {
        AsyncStorage.multiGet(['token', 'role', 'eid'])
            .then(values => {
                const [[tokenKey, token], [roleKey, role], [eidKey, eid]] = values;
    
                if (token && eid) {
                    console.log('Token:', token);
                    console.log('EID:', eid);
                }
            })
            .catch(error => {
                console.error('Error getting values:', error);
            });
    }, []);

    useEffect(() => {
        fetchData();
      }, []);
    const fetchData = async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await fetch(apiBaseUrl+'/dashboard_view?nos=20', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setFeedData(data.list_of_latest);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    return (
        <ScrollView style={styles.feedSection}>
            <View style={styles.eventsHeader}>
                <Text style={styles.eventsHeaderText}>Events for you</Text>
            </View>
            {feedData.map((item, index) => (
                <View style={styles.feedMessage} key={index}>
                <View style={styles.messageLeftColumn}>
                {item.birthdays && (
                        <Image
                            source={require('../assets/balloons.png')}
                            style={styles.imagePlaceholder}
                        />
                        )}
                        {item.events && (
                        <Image
                            source={require('../assets/conference.png')}
                            style={styles.imagePlaceholder}
                        />
                        )}
                        {!item.birthdays && !item.events && (
                        <Image
                            source={require('../assets/paper.webp')}
                            style={styles.imagePlaceholder}
                        />
                        )}
                </View>
                <View style={styles.messageRightColumn}>
                    {item.events && (
                    <Text style={styles.feedMessageTextTime}>
                        {new Date(item.created).toLocaleDateString()} - {new Date(item.created).toLocaleTimeString()}
                    </Text>
                    )}
                    {item.news && <Text style={styles.feedMessageTextTime}>{item.news.p_Date}</Text>}
                        {item.birthdays && (
                        <Text style={styles.feedMessageTextTime}>
                            {new Date(item.birthdays.dob).toLocaleDateString()}
                        </Text>
                        )}
                        <Text style={styles.feedMessageText}>
                        {item.birthdays
                            ? `${item.birthdays.emp_Name}'s Birthday Today`
                            : item.news?.title || item.events?.title}
                        </Text>
                    <Text style={styles.feedMessageText}>{item.news?.description}</Text>
                    <TouchableOpacity onPress={() => handleLinkPress(item)}>
                        <Text style={styles.feedMessageTextLink}>{item.news?.link}</Text>
                    </TouchableOpacity>
                </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    feedSection: {
        flex: 1,
        padding: 20,
    },
    feedHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    feedMessage: {
        flexDirection: 'row',
        backgroundColor: 'lightblue',
        padding: 4,
        marginBottom: 10,
        borderRadius: 5,
        maxWidth: 400,
        maxHeight:85,

    },
    messageLeftColumn: {
        width: '30%',
        paddingRight: 10,
    },
    imagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: 'lightgray',
        borderRadius: 5,
    },
    messageRightColumn: {
        width: '70%',
        marginBottom: 'auto',
        marginTop: 'auto',
    },
    feedMessageText: {
        fontSize: 14,
    },
    feedMessageTextTime: {
        fontSize: 14,
        color: 'blue',
    },
    eventsHeader: {
        textAlign:'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 10,
        marginBottom: 15,
    },
    feedMessageTextLink: {
        fontSize: 12,
        color:'purple',
    },
    eventsHeaderText: {
        alignItems:'center',
        fontSize: 20,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        textDecorationColor: '#F4CE05',
    },
});

export default UpcomingScreen;
