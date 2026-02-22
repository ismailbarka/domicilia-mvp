import { Provider } from '@/types';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { Marker } from 'react-native-maps';
import ProviderMarkerUI from './ProviderMarker';

function ProvidersMarker({ provider }: { provider: Provider }) {
  const router = useRouter();

  const onMarkerPress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    router.push({
      pathname: '/card-modal',
      params: {
        provider: JSON.stringify(provider)
      }
    });
  }, [provider, router]);
  return (
    <Marker
      coordinate={{
        latitude: provider.latitude,
        longitude: provider.longitude
      }}
      tracksViewChanges={false}
      onPress={onMarkerPress}
    >
      <ProviderMarkerUI
        categoryName={provider.categoryName}
        photoUrl={provider.photoUrl}
      />
    </Marker>
  );
}

export default React.memo(
  ProvidersMarker,
  (prev, next) =>
    prev.provider.id === next.provider.id &&
    prev.provider.latitude === next.provider.latitude &&
    prev.provider.longitude === next.provider.longitude &&
    prev.provider.categoryName === next.provider.categoryName &&
    prev.provider.photoUrl === next.provider.photoUrl
);
