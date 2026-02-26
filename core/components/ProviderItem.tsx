import { Provider } from '@/core/types/provider-type';
import { getCategoryColor } from '@/core/utils/categoryColors';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import CallButton from './home-screen/list-bottomsheet-components/call-button';
import DirectionsButton from './home-screen/list-bottomsheet-components/directions-button';
import ProviderBsicInfos from './home-screen/list-bottomsheet-components/provider-basic-infos';
import ShareButton from './home-screen/list-bottomsheet-components/share-button';
import WhatsAppButton from './home-screen/list-bottomsheet-components/whatsapp-button';

type Props = {
  provider: Provider;
};

export default function ProviderItem({ provider }: Props) {
  const categoryColor = getCategoryColor(provider.categoryName);
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <View style={[styles.photoContainer, { borderColor: categoryColor }]}>
          {provider.photoUrl ? (
            <Image source={{ uri: provider.photoUrl }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]} />
          )}
        </View>
        <ProviderBsicInfos provider={provider} />
        <ShareButton provider={provider} />
      </View>

      <View style={styles.actionRow}>
        <CallButton provider={provider} />
        <WhatsAppButton provider={provider} />
        <DirectionsButton provider={provider} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16
  },
  photoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    padding: 2,
    backgroundColor: '#fff'
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 30
  },
  photoPlaceholder: {
    backgroundColor: '#F0F0F0'
  },
  cardShareBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F8F8F8'
  },
  info: {
    flex: 1
  },
  name: {
    fontSize: 18,
    fontFamily: 'Jost-Bold',
    color: '#1A1A1A',
    marginBottom: 6
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Jost-Medium',
    fontWeight: '600'
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Jost',
    color: '#666'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6
  },
  whatsappBtn: {
    backgroundColor: '#25D366'
  },
  directionsBtn: {
    backgroundColor: '#1A1A1A'
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Jost-Medium',
    fontWeight: '600'
  }
});
