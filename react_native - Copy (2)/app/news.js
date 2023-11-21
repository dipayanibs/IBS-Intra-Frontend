import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import config from '../config';


const NewsScreen = () => {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null); 
  const route = useRoute(); 
  const apiBaseUrl = config.API_BASE_URL;
  const apiBaseUrlImage = config.API_BASE_URL_IMAGE;

  const [showAllNews, setShowAllNews] = useState(
    route.params?.defaultToggle === 'Latest' || true 
  );

  const navigation = useNavigation();

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        // Retrieve 'token' and 'eid' from AsyncStorage
        const [[tokenKey, token], [eidKey, eid]] = await AsyncStorage.multiGet(['token', 'eid']);

        if (token && eid) {
          const response = await fetch(apiBaseUrl+`/get_news?eid=No`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          if (data && data.list_of_news) {
            let newsData = data.list_of_news;
            if (!showAllNews) {
              // Sort news by date in descending order
              newsData = newsData.sort((a, b) => new Date(b.p_Date) - new Date(a.p_Date));
              // Slice the top 5 latest news items
              newsData = newsData.slice(0, 5);
            }
            // Reverse the order if showAllNews is true
            if (showAllNews) {
              newsData = newsData.reverse();
            }
            setNews(newsData);
          }
        } else {
          throw new Error('Token and/or eid not found in AsyncStorage');
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        // Handle the error by setting the error state with a message
        setError('Oops! Something went wrong. Please try again later.');
      }
    };
    fetchNewsData();
  }, [showAllNews]);

  const handleLinkPress = (item) => {
    const url = item.link;

    if (url) {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        const absoluteUrl = `http://${url}`;
        Linking.openURL(absoluteUrl)
          .then(() => console.log('URL opened successfully'))
          .catch((err) => {
            console.error('An error occurred while opening the link: ', err);
            setError('Oops! Something went wrong. Please try again later.');
          });
      } else {
        Linking.openURL(url)
          .then(() => console.log('URL opened successfully'))
          .catch((err) => {
            console.error('An error occurred while opening the link: ', err);
            setError('Oops! Something went wrong. Please try again later.');
          });
      }
    }
  };

  const handleAddNews = (newNewsItem) => {
    setNews([newNewsItem, ...news]);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>News</Text>
          <TouchableOpacity onPress={() => navigation.navigate('add_news')} style={styles.addButton}>
            <Image source={require('../assets/plus_icon.png')} style={styles.plusIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, showAllNews ? styles.activeToggle : null]}
            onPress={() => setShowAllNews(true)}>
            <Text style={styles.toggleText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !showAllNews ? styles.activeToggle : null]}
            onPress={() => setShowAllNews(false)}>
            <Text style={styles.toggleText}>Latest</Text>
          </TouchableOpacity>
        </View>

        {error ? (
          <Text style={styles.errorMessage}>{error}</Text>
        ) : (
          news.map((item, index) => (
            <View key={index} style={styles.feedMessage}>
              {/* Left Column (Placeholder Image) */}
              <View style={styles.leftColumn}>
                  <Image
                    source={
                      item.image
                        ? { uri: apiBaseUrlImage+`/${item.image}` }
                        : require('../assets/paper.webp')
                    }
                    style={styles.placeholderImage}
                  />
                </View>

              {/* Right Column (Original Content) */}
              <View style={styles.rightColumn}>
                <Text style={[styles.eventTitle, styles.padding]}>{item.title}</Text>
                <Text style={[styles.eventDate, styles.padding]}>
                  Date: {new Date(item.p_Date).toLocaleDateString()}
                </Text>
                <Text style={[styles.eventTime, styles.padding]}>
                  Time: {new Date(item.p_Date).toLocaleTimeString()}
                </Text>
                <Text style={[styles.eventDescription, styles.padding]}>{item.description}</Text>
                {item.link && (
                  <View style={styles.linkContainer}>
                    <Text style={styles.linkText}></Text>
                    <TouchableOpacity onPress={() => handleLinkPress(item)}>
                      <Text style={[styles.linkText, styles.link]}>{item.link}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 130,
  },
  feedMessage: {
    backgroundColor: 'lightblue',
    padding: 2,
    marginBottom: 10,
    borderRadius: 5,
    maxWidth: 400,
    maxHeight: 150,
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftColumn: {
    flex: 0.4,
    marginRight: 10,
  },
  rightColumn: {
    flex: 0.6,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5, // Set the height to 100% to match the height of the feedMessage
    //resizeMode: 'contain',
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
  },
  eventTime: {
    fontSize: 14,
  },
  eventDescription: {
    fontSize: 12,
    color: 'gray',

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 10,
  },
  addButton: {
    padding: 5,
  },
  plusIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  toggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#eee',
  },
  activeToggle: {
    backgroundColor: 'lightblue',
  },
  toggleText: {
    fontSize: 16,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  padding: {
    padding: 5, // Add padding to text elements
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
  },
  link: {
    color: 'purple',
    marginLeft: 5,
  },
});

export default NewsScreen;
