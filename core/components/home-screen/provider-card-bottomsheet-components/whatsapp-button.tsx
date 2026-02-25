import { Provider } from '@/core/types/provider-type';
import AppButton from '@/core/ui/app-button';
import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet } from 'react-native';

export default function WhatsAppButton({ provider }: { provider: Provider }) {
  const handleWhatsApp = async () => {
    const cleanPhone = provider.phone.replace(/\s+/g, '').replace('+', '');
    Linking.openURL(`https://wa.me/${cleanPhone}`);
  };

  return (
    <AppButton
      style={[styles.actionBtn, styles.whatsappBtn]}
      onPress={handleWhatsApp}
      title="WhatsApp"
      icon={<Ionicons name="logo-whatsapp" size={18} color="#fff" />}
    />
  );
}

const styles = StyleSheet.create({
  whatsappBtn: {
    backgroundColor: '#25D366'
  },
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
