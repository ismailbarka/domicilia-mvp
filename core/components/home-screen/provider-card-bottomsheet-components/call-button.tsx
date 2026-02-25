import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { getCategoryColor } from '@/core/utils/categoryColors';
import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet } from 'react-native';

export default function CallButton({ provider }: { provider: Provider }) {
  const categoryColor = getCategoryColor(provider.categoryName);

  const handleCall = async () => {
    Linking.openURL(`tel:${provider.phone}`);
  };
  return (
    <AppButton
      style={[styles.actionBtn, { backgroundColor: categoryColor }]}
      onPress={handleCall}
      title="Call"
      icon={<Ionicons name="call" size={18} color="#fff" />}
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
  }
});
