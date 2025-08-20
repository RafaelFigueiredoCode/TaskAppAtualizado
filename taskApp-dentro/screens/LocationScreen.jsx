import { StyleSheet, View, Text, FlatList, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import CustomButton from '../components/CustomButton';
import CustomModal from '../components/CustomModal';

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
    <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
      Sua Localização
    </Text>
    {isLoading ? (
      <ActivityIndicator size="large" color="#007bff" />
    ) : error ? (
      <>
        <Text style={[styles.errorText, theme === 'dark' && styles.darkText]}>
          {error}
        </Text>
        <CustomButton
          title="Tentar Novamente"
          onPress={getLocation}
          color="#ffc107"
        />
      </>
    ) : location ? (
      <>
        <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
          Latitude: {location.latitude.toFixed(6)}
        </Text>
        <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
          Longitude: {location.longitude.toFixed(6)}
        </Text>
        <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
          Endereço: {address || 'Carregando endereço...'}
        </Text>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Você está aqui"
            pinColor="blue"
          />
        </MapView>

        <CustomButton
          title="Atualizar Localização"
          onPress={getLocation}
          color="#007bff"
        />
      </>
    ) : (
      <Text style={[styles.text, theme === 'dark' && styles.darkText]}>
        Obtendo localização...
      </Text>
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