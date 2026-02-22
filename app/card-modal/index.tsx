import { Provider } from '@/types';
import { getCategoryColor } from '@/utils/categoryColors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function CardModalScreen() {
  const router = useRouter();
  const { provider: providerJson } = useLocalSearchParams<{
    provider: string;
  }>();

  if (!providerJson) return null;

  const provider: Provider = JSON.parse(providerJson);
  const categoryColor = getCategoryColor(provider.categoryName);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleCall = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = `tel:${provider.phone}`;
    try {
      await Linking.openURL(url);
    } catch (e) {
      console.warn('Could not open dialer:', e);
      alert('Could not open dialer on this device');
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
      alert('WhatsApp is not installed on this device');
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
      const message = `Check out ${provider.name} on Local Service Providers App!\n\nCategory: ${provider.categoryName}\nPhone: ${provider.phone}\n\nDownload the app to find local experts!`;
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
      return `${Math.round(dist)}km away`;
    }
    return `${(dist / 1000).toFixed(1)}km away`;
  };

  return (
    <Pressable style={styles.overlay} onPress={handleClose}>
      <Pressable style={styles.sheet} onPress={() => {}}>
        <View style={styles.handle} />
        <Pressable style={styles.closeBtn} onPress={handleClose}>
          <Ionicons name="close" size={22} color="#666" />
        </Pressable>
        <Pressable style={styles.shareBtn} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color="#666" />
        </Pressable>

        <View style={[styles.photoContainer, { borderColor: categoryColor }]}>
          {provider.photoUrl ? (
            <Image source={{ uri: provider.photoUrl }} style={styles.photo} />
          ) : (
            <View style={[styles.photo, styles.photoPlaceholder]} />
          )}
        </View>

        <Text style={styles.name}>{provider.name}</Text>
        <View style={styles.infoRow}>
          <View
            style={[styles.badge, { backgroundColor: categoryColor + '20' }]}
          >
            <View
              style={[styles.badgeDot, { backgroundColor: categoryColor }]}
            />
            <Text style={[styles.badgeText, { color: categoryColor }]}>
              {provider.categoryName}
            </Text>
          </View>

          <View style={styles.distanceBadge}>
            <Ionicons name="navigate-outline" size={14} color="#666" />
            <Text style={styles.distanceText}>
              {formatDistance(provider.distance)}
            </Text>
          </View>
        </View>

        {provider.description ? (
          <Text style={styles.description}>{provider.description}</Text>
        ) : null}

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.actionBtn, { backgroundColor: categoryColor }]}
            onPress={handleCall}
          >
            <Ionicons name="call" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Call</Text>
          </Pressable>

          <Pressable
            style={[styles.actionBtn, styles.whatsappBtn]}
            onPress={handleWhatsApp}
          >
            <Ionicons name="logo-whatsapp" size={18} color="#fff" />
            <Text style={styles.actionBtnText}>WhatsApp</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.actionBtn, styles.directionsBtn]}
          onPress={handleDirections}
        >
          <Ionicons name="navigate-outline" size={18} color="#fff" />
          <Text style={styles.actionBtnText}>Get Directions</Text>
        </Pressable>

        <View style={styles.phoneInfoContainer}>
          <Ionicons name="call-outline" size={18} color="#666" />
          <Text style={styles.phoneText}>{provider.phone}</Text>
        </View>
      </Pressable>
    </Pressable>
  );
}

const PHOTO_SIZE = 90;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    alignItems: 'center'
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    marginBottom: 16
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareBtn: {
    position: 'absolute',
    top: 16,
    left: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photoContainer: {
    width: PHOTO_SIZE + 6,
    height: PHOTO_SIZE + 6,
    borderRadius: (PHOTO_SIZE + 6) / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 12
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: PHOTO_SIZE / 2
  },
  photoPlaceholder: {
    backgroundColor: '#E0E0E0'
  },
  name: {
    fontSize: 22,
    fontFamily: 'Jost-Bold',
    color: '#1A1A1A',
    marginBottom: 8
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 6
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F5F5F5',
    gap: 4
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Jost-Medium',
    color: '#666'
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  badgeText: {
    fontSize: 13,
    fontFamily: 'Jost-Medium',
    fontWeight: '600'
  },
  description: {
    fontSize: 14,
    fontFamily: 'Jost',
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
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 8
  },
  whatsappBtn: {
    backgroundColor: '#25D366'
  },
  directionsBtn: {
    backgroundColor: '#1A1A1A',
    width: '100%',
    flex: 0,
    marginTop: 0,
    marginBottom: 16
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Jost-Medium',
    fontWeight: '600'
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
    fontFamily: 'Jost-Medium',
    color: '#333'
  }
});
