import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent splash screen from hiding before assets are loaded
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme() || 'light'; // Ensure default value
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuth, setIsAuth] = useState(false); // Temporary auth state

  useEffect(() => {
    console.log("Fonts Loaded:", loaded);
    console.log("Color Scheme:", colorScheme);

    if (loaded) {
      SplashScreen.hideAsync().catch(console.warn); // Ensure splash hides
    }
  }, [loaded]);

  // If fonts aren't loaded, show loading text instead of blank screen
  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ThemeProvider value={DefaultTheme}>
  {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: 'black' }}>Rendering Stack...</Text>
  </View> */}
  <Stack screenOptions={{ headerShown: false }}>
    <Stack.Screen name="index" options={{ presentation: 'modal' }} />
    <Stack.Screen name="login" options={{ presentation: 'modal' }} />
    <Stack.Screen name="register" options={{ presentation: 'modal' }} />
    <Stack.Screen name="CompleteProfile" options={{ presentation: 'card' }} />
    <Stack.Screen name="(tabs)" options={{ presentation: 'card' }} />
    <Stack.Screen name="+not-found" />
  </Stack>
  <StatusBar style="auto" />
</ThemeProvider>
  );
}
