import { BookOpen, Calendar, Calculator, Home, Search } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing } from '../constants/theme';
import type { Screen } from '../types';

interface NavBarProps {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}

const TABS: { id: Screen; label: string; Icon: React.ComponentType<any> }[] = [
  { id: 'dashboard', label: 'Inicio', Icon: Home },
  { id: 'paes', label: 'PAES', Icon: Calculator },
  { id: 'carreras', label: 'Carreras', Icon: Search },
  { id: 'beneficios', label: 'Becas', Icon: BookOpen },
  { id: 'calendario', label: 'Fechas', Icon: Calendar },
];

export default function NavBar({ active, onNavigate }: NavBarProps) {
  return (
    <View style={styles.container}>
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <TouchableOpacity
            key={id}
            style={styles.tab}
            onPress={() => onNavigate(id)}
            activeOpacity={0.7}
          >
            <Icon
              size={22}
              color={isActive ? Colors.primary : Colors.neutral500}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral300,
    paddingBottom: Spacing.md,
    paddingTop: Spacing.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    color: Colors.neutral500,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
