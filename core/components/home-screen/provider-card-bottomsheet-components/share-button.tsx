import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { Share, StyleSheet } from 'react-native';

export default function ShareButton({ provider }: { provider: Provider }) {
  const handleShare = async () => {
    const message = `Check out ${provider.name}\nCategory: ${provider.categoryName}\nPhone: ${provider.phone}`;

    Share.share({
      message,
      title: provider.name
    });
  };
  return (
    <AppButton
      style={styles.shareBtn}
      onPress={handleShare}
      icon={<Ionicons name="share-social-outline" size={20} color="#666" />}
    />
  );
}

const styles = StyleSheet.create({
  shareBtn: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  }
});
