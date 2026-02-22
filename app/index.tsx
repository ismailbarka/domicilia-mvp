import ProviderMarkerUI from '@/components/ProviderMarker';
import useGetCategories from '@/hooks/get-categories-hook';
import useGetProviders from '@/hooks/get-providers-hook';
import { Provider } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [region, setRegion] = useState<Region | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const { categories } = useGetCategories();

  const filterCategories = ['All', ...categories.map(c => c.name)];

  const { providers } = useGetProviders(
    region?.latitude.toString() || '',
    region?.longitude.toString() || '',
    '500000'
  );

  const updateLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.log('Permission denied');
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    };

    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  const onMarkerPress = useCallback(
    (provider: Provider) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push(
        `/card-modal?provider=${encodeURIComponent(
          JSON.stringify(provider)
        )}` as import('expo-router').ExternalPathString
      );
    },
    [router]
  );

  const onCategoryPress = useCallback((category: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  }, []);

  useEffect(() => {
    updateLocation();
  }, []);

  const handleLocateMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    updateLocation();
  };

  const markers = useMemo(() => {
    const filteredProviders =
      providers?.filter(provider =>
        selectedCategory === 'All'
          ? true
          : provider.categoryName?.toLowerCase() ===
            selectedCategory.toLowerCase()
      ) || [];
    return filteredProviders.map(provider => (
      <ProvidersMarker
        key={provider.id.toString()}
        provider={provider}
        onMarkerPress={onMarkerPress}
      />
    ));
  }, [providers, selectedCategory, onMarkerPress]);

  if (!region) return <View style={styles.container} />;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
      >
        {markers}
      </MapView>

      <SafeAreaView style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {filterCategories.map(category => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterButton,
                selectedCategory === category && styles.filterButtonSelected
              ]}
              onPress={() => onCategoryPress(category)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === category && styles.filterTextSelected
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      <View style={styles.floatingButtons}>
        <TouchableOpacity
          style={styles.locateButton}
          onPress={handleLocateMe}
          activeOpacity={0.7}
        >
          <Ionicons name="locate" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeToggle}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push(
              `/modal?latitude=${region.latitude}&longitude=${
                region.longitude
              }&category=${encodeURIComponent(selectedCategory)}` as import('expo-router').ExternalPathString
            );
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="list-outline" size={24} color="#FFF" />
          <Text style={styles.modeToggleText}>List View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ProvidersMarker = React.memo(function ProvidersMarker({
  provider,
  onMarkerPress
}: {
  provider: Provider;
  onMarkerPress: (provider: Provider) => void;
}) {
  const coordinate = useMemo(
    () => ({
      latitude: provider.latitude,
      longitude: provider.longitude
    }),
    [provider.latitude, provider.longitude]
  );

  const handleOnPress = useCallback(() => {
    onMarkerPress(provider);
  }, [provider, onMarkerPress]);

  return (
    <Marker
      coordinate={coordinate}
      onPress={handleOnPress}
      tracksViewChanges={false}
    >
      <ProviderMarkerUI
        categoryName={provider.categoryName}
        photoUrl={provider.photoUrl}
      />
    </Marker>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  listContainer: {
    flex: 1,
    paddingTop: 80
  },
  listTitle: {
    fontSize: 24,
    fontFamily: 'Jost-Bold',
    color: '#1A1A1A',
    paddingHorizontal: 20,
    marginBottom: 16
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100
  },
  filterContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 10
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF'
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  filterTextSelected: {
    color: 'white'
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    alignItems: 'flex-end',
    gap: 12
  },
  locateButton: {
    width: 50,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8
  },
  modeToggleText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Jost-Medium',
    fontWeight: '600'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 12
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Jost',
    color: '#999',
    textAlign: 'center'
  }
});
