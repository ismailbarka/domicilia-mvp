import { Provider } from '@/types';
import { useMemo } from 'react';

export default function useFilteredProviders(
  providers: Provider[],
  selectedCategory: string
) {
  return useMemo(() => {
    if (!providers) return [];
    if (selectedCategory === 'All') return providers;

    const lowerCategory = selectedCategory.toLowerCase();
    const filtredProviders = providers.filter(
      p => p.categoryName?.toLowerCase() === lowerCategory
    );
    console.log('filtredProviders : ', filtredProviders.length);
    return filtredProviders;
  }, [providers, selectedCategory]);
}
