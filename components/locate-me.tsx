import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function LocateMe({
  updateLocation
}: {
  updateLocation: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={updateLocation}>
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
