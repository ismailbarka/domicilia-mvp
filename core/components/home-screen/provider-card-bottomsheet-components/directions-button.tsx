import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { Alert, Linking, StyleSheet } from 'react-native';

export default function DirectionsButton({ provider }: { provider: Provider }) {
  const handleDirections = async () => {
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
  };

  return (
    <AppButton
      style={[styles.actionBtn, styles.directionsBtn]}
      onPress={handleDirections}
      title="Get Directions"
      icon={<Ionicons name="navigate-outline" size={18} color="#fff" />}
    />
  );
}

const styles = StyleSheet.create({
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8
  },
  directionsBtn: {
    backgroundColor: '#1A1A1A',
    width: '100%',
    flex: 0,
    marginBottom: 16
  }
});
