import FiltersScrollView from '@/components/home-screen/filters-scroll-view';
import LocateMe from '@/components/locate-me';
import ProvidersMarker from '@/components/providers-marker';
import useGetCategories from '@/hooks/get-categories-hook';
import useGetProviders from '@/hooks/get-providers-hook';
import useCurrentLocation from '@/hooks/home-screen/use-current-location';
import useFilteredProviders from '@/hooks/home-screen/use-filtered-providers';
import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapView from 'react-native-maps';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const mapRef = useRef<MapView | null>(null);

  const { region, updateLocation } = useCurrentLocation(mapRef);

  const { providers } = useGetProviders(
    region.latitude.toString(),
    region.longitude.toString(),
    '5000'
  );

  const filteredProviders = useFilteredProviders(providers, selectedCategory);

  const { categories } = useGetCategories();

  const filterCategories = useMemo(() => {
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  useEffect(() => {
    updateLocation();
  }, [updateLocation]);
  if (region.latitude === 0.0) return null;

  return (
    <View style={styles.container}>
      <FiltersScrollView
        filterCategories={filterCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation
      >
        {filteredProviders?.map(provider => (
          <ProvidersMarker
            key={provider.id.toString()}
            provider={provider}
          ></ProvidersMarker>
        ))}
      </MapView>
      <LocateMe updateLocation={updateLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  }
});
