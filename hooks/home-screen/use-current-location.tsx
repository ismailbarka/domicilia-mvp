import * as Location from 'expo-location';
import { RefObject, useEffect, useState } from 'react';
import MapView, { Region } from 'react-native-maps';

export default function useCurrentLocation(mapRef: RefObject<MapView | null>) {
  const [region, setRegion] = useState<Region>({
    latitude: 0.0,
    longitude: 0.0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });

  const updateLocation = async () => {
    console.log('test');
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') return;

    const location = await Location.getCurrentPositionAsync({});

    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    };

    setRegion(newRegion);
    mapRef?.current?.animateToRegion(newRegion, 1000);
    return newRegion;
  };

  useEffect(() => {
    updateLocation();
  }, []);

  return { region, setRegion, updateLocation };
}
