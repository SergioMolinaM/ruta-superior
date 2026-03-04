import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import RutaChat from '../../components/RutaChat';
import { Colors } from '../../constants/theme';
import { useProfile } from '../context';

export default function ChatScreen() {
    const { profile } = useProfile();

    if (!profile) return null;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.slate900} />
            <RutaChat profile={profile} fullScreen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.primaryDark, // Match the chat header
    },
});
