import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import BeneficiosScreen from '../../components/BeneficiosScreen';
import CalendarioScreen from '../../components/CalendarioScreen';
import CarrerasExplorer from '../../components/CarrerasExplorer';
import Dashboard from '../../components/Dashboard';
import PaesCalculator from '../../components/PaesCalculator';
import { Colors } from '../../constants/theme';
import type { Screen } from '../../types';
import { useProfile } from '../context';

export default function IndexScreen() {
  const { profile } = useProfile();
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');

  if (!profile) return null; // Safe guard, should be caught by route guard

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'paes':
        return <PaesCalculator onBack={() => handleNavigate('dashboard')} />;
      case 'calendario':
        return <CalendarioScreen onBack={() => handleNavigate('dashboard')} />;
      case 'beneficios':
        return <BeneficiosScreen onBack={() => handleNavigate('dashboard')} />;
      case 'carreras':
        return <CarrerasExplorer profile={profile} onBack={() => handleNavigate('dashboard')} />;
      case 'dashboard':
      default:
        return <Dashboard profile={profile} onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.slate50} />
      {renderScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
});
