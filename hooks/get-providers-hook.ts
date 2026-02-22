import { getProviders } from '@/services/api/providersApi';
import { Provider } from '@/types';
import { useEffect, useState } from 'react';

export default function useGetProviders(
  latitude: string,
  longitude: string,
  distance: string
) {
  const [providers, setproviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getNewProviders = async () => {
    if (!latitude || !longitude) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await getProviders(latitude, longitude, distance);
      setproviders(data || []);
    } catch (e) {
      console.error('Error fetching providers:', e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log('latitude', latitude);
    console.log('longitude', longitude);
    getNewProviders();
  }, [latitude, longitude]);
  return { providers, loading };
}
