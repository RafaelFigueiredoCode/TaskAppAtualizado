import { StyleSheet, View, Text, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CustomButton from '../components/CustomButton';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { useTasks } from '../contexts/TaskContext';

export default function LocationScreen() {
  const { theme } = useSelector((state) => state.tasks);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permissão de localização negada');
        setIsLoading(false);
        return;
      }

      const locationData = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = locationData.coords;
      setLocation({ latitude, longitude });

      // Geocodificação reversa com OpenStreetMap
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          {
            headers: {
              'User-Agent': 'taskApp/1.0 (https://github.com/username/taskApp)'
            }
          }
        );
        setAddress(response.data.display_name);
      } catch (err) {
        setAddress('Erro ao obter endereço');
        console.error('Erro na geocodificação:', err);
      }

      setIsLoading(false);
    } catch (err) {
      setError('Erro ao obter localização: ' + err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      {isLoading && <ActivityIndicator size="large" />}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {address && <Text style={styles.text}>{address}</Text>}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} title="Minha localização" />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    marginBottom: 10,
  },
  darkText: {
    color: '#fff',
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
  },
});