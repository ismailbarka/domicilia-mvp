import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { Alert, Linking, StyleSheet } from 'react-native';

export default function DirectionsButton({ provider }: { provider: Provider }) {
  const handleDirections = useCallback(async () => {
    const lat = provider.latitude;
    const lng = provider.longitude;

    const openAppleMaps = () => {
      Linking.openURL(`maps://app?daddr=${lat},${lng}&t=m`);
    };

    const openGoogleMaps = async () => {
      const url = `comgooglemaps://?daddr=${lat},${lng}&directionsmode=driving`;
      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        Linking.openURL(url);
      } else {
        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        );
      }
    };

    Alert.alert(
      'Get Directions',
      'Choose your preferred map:',
      [
        { text: 'Apple Maps', onPress: openAppleMaps },
        { text: 'Google Maps', onPress: openGoogleMaps },
        { text: 'Cancel', style: 'cancel' }
      ],
      { cancelable: true }
    );
  }, [provider.latitude, provider.longitude]);

  return (
    <AppButton
      style={[styles.actionBtn, styles.whatsappBtn]}
      onPress={handleDirections}
      title="Directions"
      icon={<Ionicons name="navigate" size={16} color="#fff" />}
    />
  );
}

const styles = StyleSheet.create({
  whatsappBtn: {
    backgroundColor: '#1A1A1A'
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8,
    width: '100%'
  }
});
