import { Provider } from '@/core/types/provider-type';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Marker } from 'react-native-maps';
import ProviderMarkerUI from './provider-marker';

function ProvidersMarker({
  provider,
  setSelectedProvider,
  isVisible = true
}: {
  provider: Provider;
  setSelectedProvider: (provider: Provider | null) => void;
  isVisible?: boolean;
}) {
  const [tracksViewChanges, setTracksViewChanges] = useState(true);

  useEffect(() => {
    setTracksViewChanges(true);
    const timeout = setTimeout(() => {
      setTracksViewChanges(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [isVisible]);

  const handlePress = useCallback(() => {
    if (!isVisible) return;
    setSelectedProvider(provider);
  }, [provider, setSelectedProvider, isVisible]);

  const coordinate = useMemo(() => {
    return {
      latitude: provider.latitude,
      longitude: provider.longitude
    };
  }, [provider.latitude, provider.longitude]);

  return (
    <Marker
      coordinate={coordinate}
      tracksViewChanges={tracksViewChanges}
      onPress={handlePress}
      title={provider.name}
      opacity={isVisible ? 1 : 0}
    >
      <ProviderMarkerUI
        categoryName={provider.categoryName}
        photoUrl={provider.photoUrl}
      />
    </Marker>
  );
}

export default memo(ProvidersMarker, (prev, next) => {
  return (
    prev.provider.id === next.provider.id && prev.isVisible === next.isVisible
  );
});
