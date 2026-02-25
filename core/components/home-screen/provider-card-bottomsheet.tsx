import { Provider } from '@/core/types/provider-type';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Modalize } from 'react-native-modalize';
import CallButton from './provider-card-bottomsheet-components/call-button';
import CloseButton from './provider-card-bottomsheet-components/close-button';
import DirectionsButton from './provider-card-bottomsheet-components/directions-button';
import InfoRow from './provider-card-bottomsheet-components/info-row';
import ProfilePhoto from './provider-card-bottomsheet-components/profile-photo';
import ShareButton from './provider-card-bottomsheet-components/share-button';
import WhatsAppButton from './provider-card-bottomsheet-components/whatsapp-button';

export default function ProviderCardBottomsheet({
  setSelectedProvider,
  provider
}: {
  setSelectedProvider: (provider: Provider | null) => void;
  provider: Provider;
}) {
  const modalRef = useRef<Modalize>(null);

  useEffect(() => {
    modalRef.current?.open();
  }, []);

  const handleClose = useCallback(() => {
    setTimeout(() => {
      setSelectedProvider(null);
    }, 500);
  }, [setSelectedProvider]);

  return (
    <Modalize
      ref={modalRef}
      adjustToContentHeight
      onClosed={handleClose}
      handlePosition="inside"
      modalStyle={styles.modal}
      panGestureEnabled
      closeOnOverlayTap
    >
      <View style={styles.sheet}>
        <CloseButton onPress={() => modalRef.current?.close()} />
        <ShareButton provider={provider} />
        <ProfilePhoto provider={provider} />
        <Text style={styles.name}>{provider.name}</Text>
        <InfoRow provider={provider} />
        {provider.description && (
          <Text style={styles.description}>{provider.description}</Text>
        )}
        <View style={styles.actionRow}>
          <CallButton provider={provider} />
          <WhatsAppButton provider={provider} />
        </View>
        <DirectionsButton provider={provider} />
        <View style={styles.phoneInfoContainer}>
          <Ionicons name="call-outline" size={18} color="#666" />
          <Text style={styles.phoneText}>{provider.phone}</Text>
        </View>
      </View>
    </Modalize>
  );
}

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden'
  },

  sheet: {
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    minHeight: 300
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8
  },

  description: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 16
  },

  phoneInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 14,
    padding: 12,
    width: '100%',
    justifyContent: 'center',
    gap: 8
  },

  phoneText: {
    fontSize: 15,
    color: '#333'
  }
});
