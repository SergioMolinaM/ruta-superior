import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import BeneficiosScreen from '../../components/BeneficiosScreen';
import CalendarioScreen from '../../components/CalendarioScreen';
import CarrerasExplorer from '../../components/CarrerasExplorer';
import Dashboard from '../../components/Dashboard';
import NavBar from '../../components/NavBar';
import PaesCalculator from '../../components/PaesCalculator';
import RutaChat from '../../components/RutaChat';
import WelcomeScreen from '../../components/WelcomeScreen';
import { Colors } from '../../constants/theme';
import type { Screen, UserProfile } from '../../types';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [screen, setScreen] = useState<Screen>('dashboard');

  // Onboarding: mostrar hasta que el usuario complete su perfil
  if (!profile) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <WelcomeScreen onComplete={setProfile} />
      </SafeAreaView>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <Dashboard profile={profile} onNavigate={setScreen} />;
      case 'paes':
        return <PaesCalculator profile={profile} />;
      case 'carreras':
        return <CarrerasExplorer profile={profile} />;
      case 'beneficios':
        return <BeneficiosScreen profile={profile} />;
      case 'calendario':
        return <CalendarioScreen />;
      default:
        return <Dashboard profile={profile} onNavigate={setScreen} />;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      {renderScreen()}
      <RutaChat />
      <NavBar active={screen} onNavigate={setScreen} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
