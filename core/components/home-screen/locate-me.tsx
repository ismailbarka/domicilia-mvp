import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Region } from 'react-native-maps';

export default function LocateMe({
  region,
  mapRef
}: {
  region: Region;
  mapRef: React.RefObject<MapView | null>;
}) {
  const handleLocateMe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

    mapRef.current?.animateToRegion(region, 500);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLocateMe}>
      <Ionicons name="locate" size={24} color="#007AFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
