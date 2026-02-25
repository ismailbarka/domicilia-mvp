import ProviderItem from '@/core/components/ProviderItem';
import useGetProviders from '@/core/hooks/get-providers-hook';
import { Provider } from '@/core/types/provider-type';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function ListModalScreen() {
  const router = useRouter();
  const { latitude, longitude, category } = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    category: string;
  }>();

  const { providers } = useGetProviders(
    latitude || '',
    longitude || '',
    '500000'
  );

  const filteredProviders =
    providers?.filter(provider =>
      category === 'All'
        ? true
        : provider.categoryName?.toLowerCase() ===
          (category as string).toLowerCase()
    ) || [];

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleProviderPress = (item: Provider) => {
    router.replace(
      `/card-modal?provider=${encodeURIComponent(JSON.stringify(item))}` as import('expo-router').ExternalPathString
    );
  };

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {category === 'All' ? 'All Providers' : `${category}s`}
          </Text>
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Ionicons name="close" size={24} color="#1A1A1A" />
          </Pressable>
        </View>

        <FlatList
          data={filteredProviders}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <ProviderItem
              provider={item}
              onPress={() => handleProviderPress(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>
                No providers found in this category
              </Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  container: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF'
  },
  title: {
    fontSize: 22,
    fontFamily: 'Jost-Bold',
    color: '#1A1A1A'
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    gap: 12
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Jost',
    color: '#999',
    textAlign: 'center'
  }
});
