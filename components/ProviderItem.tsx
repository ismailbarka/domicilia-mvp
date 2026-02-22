import { Provider } from '@/types';
import { getCategoryColor } from '@/utils/categoryColors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Alert,
  Image,
  Linking,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View
} from 'react-native';

type Props = {
  provider: Provider;
  onPress: () => void;
};

export default function ProviderItem({ provider, onPress }: Props) {
  const categoryColor = getCategoryColor(provider.categoryName);

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const handleCall = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `tel:${provider.phone}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('Could not open dialer:', e);
    }
  };

  const handleWhatsApp = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const cleanPhone = provider.phone.replace(/\s+/g, '').replace('+', '');
    const url = `https://wa.me/${cleanPhone}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('Could not open WhatsApp:', e);
    }
  };

  const handleDirections = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const lat = provider.latitude;
    const lng = provider.longitude;

    const openAppleMaps = () => {
      const url = `maps://app?daddr=${lat},${lng}&t=m`;
      Linking.openURL(url);
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
      'Choose your preferred map application:',
      [
        {
          text: 'Apple Maps',
          onPress: openAppleMaps
        },
        {
          text: 'Google Maps',
          onPress: openGoogleMaps
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const message = `Check out ${provider.name} for ${provider.categoryName} services!\n\nPhone: ${provider.phone}\n\nShared from Local Service Providers App`;
      await Share.share({
        message,
        title: `Share ${provider.name}`
      });
    } catch (e) {
      console.warn('Error sharing:', e);
    }
  };

  const formatDistance = (dist: number) => {
    if (dist < 1000) {
      return `${Math.round(dist)}m`;
    }
    return `${(dist / 1000).toFixed(1)}km`;
  };

  return (
    <Pressable style={styles.container} onPress={handleCardPress}>
      <View style={styles.topSection}>
        <View style={[styles.photoContainer, { borderColor: categoryColor }]}>
          {provider.photoUrl ? (
            <Image source={{ uri: provider.photoUrl }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]} />
          )}
        </View>

        <Pressable
          style={styles.cardShareBtn}
          onPress={handleShare}
          hitSlop={10}
        >
          <Ionicons name="share-social-outline" size={18} color="#666" />
        </Pressable>

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {provider.name}
          </Text>

          <View style={styles.metaRow}>
            <View
              style={[styles.badge, { backgroundColor: categoryColor + '15' }]}
            >
              <View
                style={[styles.badgeDot, { backgroundColor: categoryColor }]}
              />
              <Text style={[styles.badgeText, { color: categoryColor }]}>
                {provider.categoryName}
              </Text>
            </View>

            <View style={styles.distanceRow}>
              <Ionicons name="navigate-outline" size={12} color="#666" />
              <Text style={styles.distanceText}>
                {formatDistance(provider.distance)} away
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable
          style={[styles.actionBtn, { backgroundColor: categoryColor }]}
          onPress={handleCall}
        >
          <Ionicons name="call" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Call</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.whatsappBtn]}
          onPress={handleWhatsApp}
        >
          <Ionicons name="logo-whatsapp" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>WhatsApp</Text>
        </Pressable>

        <Pressable
          style={[styles.actionBtn, styles.directionsBtn]}
          onPress={handleDirections}
        >
          <Ionicons name="navigate" size={16} color="#fff" />
          <Text style={styles.actionBtnText}>Directions</Text>
        </Pressable>
      </View>
    </Pressable>
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
