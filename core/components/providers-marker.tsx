import { Provider } from '@/core/types/provider-type';
import React, { useCallback, useMemo } from 'react';
import { Marker } from 'react-native-maps';
import ProviderMarkerUI from './ProviderMarker';

export default function ProvidersMarker({
  provider,
  setSelectedProvider
}: {
  provider: Provider;
  setSelectedProvider: (provider: Provider | null) => void;
}) {
  const handlePress = useCallback(() => {
    setSelectedProvider(provider);
  }, [provider, setSelectedProvider]);

  const coordinate = useMemo(() => {
    return {
      latitude: provider.latitude,
      longitude: provider.longitude
    };
  }, [provider.latitude, provider.longitude]);

  return (
    <Marker
      coordinate={coordinate}
      tracksViewChanges={false}
      onPress={handlePress}
      title={provider.name}
    >
      <ProviderMarkerUI
        categoryName={provider.categoryName}
        photoUrl={provider.photoUrl}
      />
    </Marker>
  );
}
