import {
  Jost_400Regular,
  Jost_500Medium,
  Jost_700Bold,
  useFonts
} from '@expo-google-fonts/jost';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect } from 'react';
import 'react-native-gesture-handler';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Jost: Jost_400Regular,
    'Jost-Medium': Jost_500Medium,
    'Jost-Bold': Jost_700Bold
  });

  const loadApp = useCallback(async () => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    loadApp();
  }, [loadApp]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal/index"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
