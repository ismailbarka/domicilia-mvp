import FiltersScrollView from '@/core/components/home-screen/filters-scroll-view';
import LocateMe from '@/core/components/home-screen/locate-me';
import ProviderCardBottomsheet from '@/core/components/home-screen/provider-card-bottomsheet';
import ProvidersMarker from '@/core/components/providers-marker';
import useGetCategories from '@/core/hooks/get-categories-hook';
import useGetProviders from '@/core/hooks/get-providers-hook';
import useCurrentLocation from '@/core/hooks/use-current-location';
import useFilteredProviders from '@/core/hooks/use-filtered-providers';
import { Provider } from '@/core/types/provider-type';
import React, { useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapView from 'react-native-maps';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const mapRef = useRef<MapView | null>(null);

  const { region } = useCurrentLocation();

  const { providers } = useGetProviders(
    region?.latitude.toString(),
    region?.longitude.toString(),
    '5000'
  );
  const filteredProviders = useFilteredProviders(providers, selectedCategory);

  const { categories } = useGetCategories();

  const filterCategories = useMemo(() => {
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        showsUserLocation
        provider="google"
      >
        {providers?.map(provider => {
          const isVisible =
            filteredProviders?.some(p => p.id === provider.id) ?? false;
          return (
            <ProvidersMarker
              key={provider.id.toString()}
              provider={provider}
              setSelectedProvider={setSelectedProvider}
              isVisible={isVisible}
            />
          );
        })}
      </MapView>

      <FiltersScrollView
        filterCategories={filterCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {selectedProvider && (
        <ProviderCardBottomsheet
          provider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
        />
      )}
      <LocateMe region={region} mapRef={mapRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
