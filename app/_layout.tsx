import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-reanimated';

// Force theme reload
import '@/constants/theme';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ProfileProvider, useProfile } from './context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { profile } = useProfile();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    const strSegment = segments[0] as string;
    if (!profile && inTabsGroup) {
      // Redirect to welcome screen if no profile and trying to access app
      router.replace('/welcome' as any);
    } else if (profile && strSegment === 'welcome') {
      // Redirect to tabs if profile exists and trying to access welcome
      router.replace('/(tabs)');
    }
  }, [profile, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="welcome" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ProfileProvider>
      <RootLayoutNav />
    </ProfileProvider>
  );
}
