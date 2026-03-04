import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import BeneficiosScreen from '../../components/BeneficiosScreen';
import { Colors, Radius, Shadow, Spacing, Typography } from '../../constants/theme';
import { useProfile } from '../context';

export default function PerfilScreen() {
    const { profile } = useProfile();

    if (!profile) return null;

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.slate50} />
            <ScrollView contentContainerStyle={styles.content}>

                <View style={styles.headerCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{profile.nombre.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{profile.nombre}</Text>
                        <Text style={styles.userRegion}>{profile.region}</Text>
                    </View>
                </View>

                <View style={styles.metricsGrid}>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>NEM</Text>
                        <Text style={styles.metricValue}>{profile.nem}</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>Ranking</Text>
                        <Text style={styles.metricValue}>{profile.ranking}</Text>
                    </View>
                    <View style={styles.metricCard}>
                        <Text style={styles.metricLabel}>RSH</Text>
                        <Text style={styles.metricValue}>{profile.rsh}%</Text>
                    </View>
                </View>

                {/* Reutilizamos componente BeneficiosScreen ajustado al container */}
                <View style={styles.beneficiosContainer}>
                    <Text style={styles.sectionTitle}>Beneficios Alcanzables</Text>
                    <View style={styles.beneficiosWrapper}>
                        <BeneficiosScreen profile={profile} />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.slate50,
    },
    content: {
        padding: Spacing.md,
        gap: Spacing.md,
        paddingBottom: Spacing.xxl * 2,
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderRadius: Radius.xl,
        ...Shadow.card,
        gap: Spacing.md,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: Radius.full,
        backgroundColor: Colors.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.primary,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...Typography.h2,
    },
    userRegion: {
        ...Typography.bodySmall,
    },
    metricsGrid: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    metricCard: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: Radius.lg,
        ...Shadow.sm,
        alignItems: 'center',
    },
    metricLabel: {
        ...Typography.label,
        marginBottom: Spacing.xs,
    },
    metricValue: {
        ...Typography.h3,
        color: Colors.primary,
    },
    sectionTitle: {
        ...Typography.h3,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.sm,
    },
    beneficiosContainer: {
        marginTop: Spacing.sm,
    },
    beneficiosWrapper: {
        backgroundColor: Colors.white,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        height: 600, // Limitar altura para mantenerlo empaquetado
        ...Shadow.card,
    }
});
