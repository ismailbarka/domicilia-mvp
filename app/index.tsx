import FiltersScrollView from '@/core/components/home-screen/filters-scroll-view';
import ListCardBottomsheet from '@/core/components/home-screen/list-card-bottomsheet';
import LocateMe from '@/core/components/home-screen/locate-me';
import ProviderCardBottomsheet from '@/core/components/home-screen/provider-card-bottomsheet';
import ProvidersMarker from '@/core/components/providers-marker';
import useGetCategories from '@/core/hooks/get-categories-hook';
import useGetProviders from '@/core/hooks/get-providers-hook';
import useCurrentLocation from '@/core/hooks/use-current-location';
import useFilteredProviders from '@/core/hooks/use-filtered-providers';
import { trackEvent } from '@/core/services/analytics';
import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import MapView from 'react-native-maps';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isListOpen, setIsListOpen] = useState(false);
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
  const visibleProviderIds = useMemo(
    () => new Set(filteredProviders.map(p => p.id)),
    [filteredProviders]
  );

  const { categories } = useGetCategories();

  const filterCategories = useMemo(() => {
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  const handleOpenList = useCallback(() => {
    trackEvent('open_list_button_click');
    setIsListOpen(true);
  }, []);

  return (
    <View className="flex-1">
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation
          // provider="google"
        >
          {providers?.map(provider => {
            return (
              <ProvidersMarker
                key={provider.id.toString()}
                provider={provider}
                setSelectedProvider={setSelectedProvider}
                isVisible={visibleProviderIds.has(provider.id)}
              />
            );
          })}
        </MapView>

        <FiltersScrollView
          filterCategories={filterCategories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </View>
      {selectedProvider && (
        <ProviderCardBottomsheet
          provider={selectedProvider}
          setSelectedProvider={setSelectedProvider}
        />
      )}
      <LocateMe region={region} mapRef={mapRef} />
      <AppButton
        style={styles.button}
        onPress={handleOpenList}
        icon={<Ionicons name="list" size={24} color="#007AFF" />}
      />
      {isListOpen && (
        <ListCardBottomsheet
          onPress={setIsListOpen}
          providers={filteredProviders}
          category={selectedCategory}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  },
  button: {
    position: 'absolute',
    bottom: 40,
    left: 20, // bottom-left corner
    width: 50, // same width as LocateMe
    height: 50, // same height as LocateMe
    borderRadius: 25, // circular like LocateMe
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  }
});
