import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import Dashboard from '../../components/Dashboard';
import { Colors } from '../../constants/theme';
import { useProfile } from '../context';

export default function IndexScreen() {
  const { profile } = useProfile();

  if (!profile) return null; // Safe guard, should be caught by route guard

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.slate50} />
      <Dashboard profile={profile} onNavigate={() => { }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
});
