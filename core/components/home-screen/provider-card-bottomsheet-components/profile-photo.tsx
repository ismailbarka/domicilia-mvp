import { Provider } from '@/core/types/provider-type';
import { getCategoryColor } from '@/core/utils/categoryColors';
import { Image, StyleSheet, View } from 'react-native';

const PHOTO_SIZE = 90;

export default function ProfilePhoto({ provider }: { provider: Provider }) {
  const categoryColor = getCategoryColor(provider.categoryName);
  return (
    <View style={[styles.photoContainer, { borderColor: categoryColor }]}>
      {provider.photoUrl ? (
        <Image source={{ uri: provider.photoUrl }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.photoPlaceholder]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  photoContainer: {
    width: PHOTO_SIZE + 6,
    height: PHOTO_SIZE + 6,
    borderRadius: (PHOTO_SIZE + 6) / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    marginTop: 10
  },

  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2
  },

  photoPlaceholder: {
    backgroundColor: '#E0E0E0'
  }
});
