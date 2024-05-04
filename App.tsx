/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Image,TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [recentImages, setRecentImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentImages = async () => {
      try {
        // Check if cached images are available
        const cachedImages = await AsyncStorage.getItem('recentImages');
        if (cachedImages) {
          setRecentImages(JSON.parse(cachedImages));
          setLoading(false);
        } else {
          const response = await fetch(
            'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s'
          );
          const data = await response.json();
          if (data && data.photos && data.photos.photo) {
            const urls = data.photos.photo.map(photo => photo.url_s);
            setRecentImages(urls);
            await AsyncStorage.setItem('recentImages', JSON.stringify(urls));
            setLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching recent images:', error);
        setLoading(false);
      }
    };

    fetchRecentImages();
  }, []);

  const refreshImages = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&page=1&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s'
      );
      const data = await response.json();
      if (data && data.photos && data.photos.photo) {
        const urls = data.photos.photo.map(photo => photo.url_s);
        setRecentImages(urls);
        await AsyncStorage.setItem('recentImages', JSON.stringify(urls));
      }
    } catch (error) {
      console.error('Error refreshing recent images:', error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navbarText}>Home</Text>
        {/* Add more navbar options here if needed */}
      </View>

      {/* Content */}
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollView}>
          {recentImages.map((url, index) => (
            <Image key={index} source={{ uri: url }} style={styles.image} />
          ))}
        </ScrollView>
      )}

      {/* Refresh Button */}
      <TouchableOpacity onPress={refreshImages} style={styles.button}>
        <Text style={styles.buttonText}>Refresh Images</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
  },
  navbarText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: 300,
    height: 200,
    marginVertical: 10,
  },
  button: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginVertical: 10,
    marginHorizontal: 50,
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

export default App;