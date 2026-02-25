import { Category } from '@/core/types/category-types';
import { api } from './client';

export const getProviders = async (
  latitude: string,
  longitude: string,
  distance: string
) => {
  const { data } = await api.get(
    `/providers?lat=${latitude}&lng=${longitude}&distance=${distance}`
  );
  return data;
};

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};
