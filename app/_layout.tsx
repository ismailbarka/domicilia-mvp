import {
  Jost_400Regular,
  Jost_500Medium,
  Jost_700Bold,
  useFonts
} from '@expo-google-fonts/jost';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Jost: Jost_400Regular,
    'Jost-Medium': Jost_500Medium,
    'Jost-Bold': Jost_700Bold
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return <Stack />;
}
