import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import CarrerasExplorer from '../../components/CarrerasExplorer';
import { Colors } from '../../constants/theme';
import { useProfile } from '../context';

export default function ComparadorScreen() {
    const { profile } = useProfile();

    if (!profile) return null;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.slate50} />
            <CarrerasExplorer profile={profile} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.slate50,
    },
});
