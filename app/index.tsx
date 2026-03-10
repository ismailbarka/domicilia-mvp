import FiltersScrollView from '@/core/components/home-screen/filters-scroll-view';
import ListCardBottomsheet from '@/core/components/home-screen/list-card-bottomsheet';
import LocateMe from '@/core/components/home-screen/locate-me';
import ProviderCardBottomsheet from '@/core/components/home-screen/provider-card-bottomsheet';
import ProvidersMarker from '@/core/components/providers-marker';
import useCategories from '@/core/hooks/queries/use-categories';
import useProviders from '@/core/hooks/queries/use-providers';
import useCurrentLocation from '@/core/hooks/use-current-location';
import useFilteredProviders from '@/core/hooks/use-filtered-providers';
import { trackEvent } from '@/core/services/analytics';
import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import MapView from 'react-native-maps';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const mapRef = useRef<MapView | null>(null);

  const { region } = useCurrentLocation();

  const lat = region?.latitude?.toString();
  const lng = region?.longitude?.toString();

  const {
    data: providers = [],
    isLoading,
    isError,
    error
  } = useProviders(lat, lng, '5000');
  const filteredProviders = useFilteredProviders(providers, selectedCategory);
  const visibleProviderIds = useMemo(
    () => new Set(filteredProviders.map(p => p.id)),
    [filteredProviders]
  );

  const {
    data: categories = [],
    isLoading: categoriesIsLoading,
    isError: categoriesIsError,
    error: categoriesError
  } = useCategories();
  const filterCategories = useMemo(() => {
    return ['All', ...categories.map(c => c.name)];
  }, [categories]);

  const handleOpenList = useCallback(() => {
    trackEvent('open_list_button_click');
    setIsListOpen(true);
  }, []);

  const handleLocateMe = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
    mapRef.current?.animateToRegion(region, 500);
  }, [mapRef, region]);

  const handleCloseList = useCallback(() => {
    setIsListOpen(false);
  }, []);

  if (isLoading || categoriesIsLoading)
    return (
      <View className="flex-1 items-center justify-center">
        <Text>isLoading</Text>
      </View>
    );

  if (isError || categoriesIsError) {
    console.log('error : ', error);
    console.log('data : ', categoriesError);
    return (
      <View className="flex-1 items-center justify-center">
        <Text>isError</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={false}
          showsCompass={false}
          showsScale={false}
          showsTraffic={false}
          showsBuildings={false}
          showsIndoors={false}
          toolbarEnabled={false}
          zoomControlEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
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
          category={selectedCategory}
          onSelectedCategoryChange={setSelectedCategory}
        />
      </View>
      {selectedProvider && (
        <ProviderCardBottomsheet
          provider={selectedProvider}
          onSelectedProvider={setSelectedProvider}
        />
      )}
      <LocateMe onPress={handleLocateMe} />
      <AppButton
        style={styles.button}
        onPress={handleOpenList}
        icon={<Ionicons name="list" size={24} color="#007AFF" />}
      />
      {isListOpen && (
        <ListCardBottomsheet
          onClose={handleCloseList}
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
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  }
});
