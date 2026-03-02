import '@/core/services/firebase';

import {
  Jost_400Regular,
  Jost_500Medium,
  Jost_700Bold,
  useFonts
} from '@expo-google-fonts/jost';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-gesture-handler';

import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Jost: Jost_400Regular,
    'Jost-Medium': Jost_500Medium,
    'Jost-Bold': Jost_700Bold
  });

  useEffect(() => {
    const loadApp = async () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    };
    loadApp();
  }, [error, loaded]);

  if (!loaded && !error) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
