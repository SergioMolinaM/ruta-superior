import { Tabs } from 'expo-router';
import React from 'react';

/**
 * La navegación por tabs está manejada internamente por la app (NavBar.tsx).
 * Este layout oculta la barra de tabs nativa de expo-router para evitar duplicados.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Mi Camino a la U' }} />
    </Tabs>
  );
}
