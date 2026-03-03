import { ExternalLink, Mail, MapPin } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../constants/theme';

const CANALES_OFICIALES = [
    { nombre: 'DEMRE', desc: 'Admisión y PAES', link: 'https://demre.cl', color: Colors.blueLightApp },
    { nombre: 'MINEDUC / FUAS', desc: 'Becas y Gratuidad', link: 'https://beneficiosestudiantiles.cl', color: Colors.successBg },
    { nombre: 'Comisión Ingresa', desc: 'Crédito CAE', link: 'https://ingresa.cl', color: Colors.warningBgApp }
];

const ORIENTADORES: Record<string, { region: string; email: string }> = {
    Norte: { region: 'Arica a Coquimbo', email: 'orienta.norte@mineduc.cl' },
    Centro: { region: 'Valparaíso a Maule', email: 'orienta.centro@mineduc.cl' },
    Sur: { region: 'Ñuble a Magallanes', email: 'orienta.sur@mineduc.cl' },
};

export default function RedApoyo() {
    const [zona, setZona] = useState<keyof typeof ORIENTADORES | ''>('');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconWrap}>
                    <Text style={{ fontSize: 20 }}>🤝</Text>
                </View>
                <View>
                    <Text style={styles.title}>Red de Apoyo</Text>
                    <Text style={styles.subtitle}>Instituciones y orientadores a tu disposición</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Canales Oficiales</Text>
            <View style={styles.grid}>
                {CANALES_OFICIALES.map((canal, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.card, { backgroundColor: canal.color }]}
                        onPress={() => Linking.openURL(canal.link)}
                    >
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardTitle}>{canal.nombre}</Text>
                            <Text style={styles.cardDesc}>{canal.desc}</Text>
                        </View>
                        <ExternalLink color={Colors.neutral700} size={16} />
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Orientadores por Zona</Text>
            <Text style={styles.helpText}>Selecciona tu macrozona para ver el contacto de un orientador asignado.</Text>

            <View style={styles.zonasRow}>
                {(Object.keys(ORIENTADORES) as Array<keyof typeof ORIENTADORES>).map(z => (
                    <TouchableOpacity
                        key={z}
                        style={[styles.zonaBtn, zona === z && styles.zonaBtnActive]}
                        onPress={() => setZona(z)}
                    >
                        <Text style={[styles.zonaText, zona === z && styles.zonaTextActive]}>{z}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {zona !== '' && (
                <View style={styles.orientadorCard}>
                    <View style={styles.orientadorHeader}>
                        <MapPin size={18} color={Colors.blueAction} />
                        <Text style={styles.orientadorRegion}>{ORIENTADORES[zona].region}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.emailRow}
                        onPress={() => Linking.openURL(`mailto:${ORIENTADORES[zona].email}`)}
                    >
                        <Mail size={16} color={Colors.neutral700} />
                        <Text style={styles.emailText}>{ORIENTADORES[zona].email}</Text>
                    </TouchableOpacity>
                    <Text style={styles.emailSub}>* Tiempos de respuesta: 24 a 48 hrs hábiles.</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        ...Shadow.card,
        marginTop: Spacing.lg,
        marginBottom: Spacing.xl,
        borderWidth: 1,
        borderColor: Colors.neutral300,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        gap: Spacing.md,
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.blueLightApp,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.neutral900,
    },
    subtitle: {
        fontSize: 12,
        color: Colors.neutral500,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.navy,
        marginBottom: Spacing.sm,
        marginTop: Spacing.xs,
    },
    grid: {
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.md,
        borderRadius: Radius.md,
    },
    cardInfo: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.neutral900,
    },
    cardDesc: {
        fontSize: 12,
        color: Colors.neutral700,
    },
    helpText: {
        fontSize: 12,
        color: Colors.neutral500,
        marginBottom: Spacing.sm,
    },
    zonasRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    zonaBtn: {
        flex: 1,
        paddingVertical: Spacing.sm,
        borderWidth: 1.5,
        borderColor: Colors.neutral300,
        borderRadius: Radius.sm,
        alignItems: 'center',
    },
    zonaBtnActive: {
        borderColor: Colors.blueAction,
        backgroundColor: Colors.blueLightApp,
    },
    zonaText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.neutral700,
    },
    zonaTextActive: {
        color: Colors.blueAction,
        fontWeight: '700',
    },
    orientadorCard: {
        backgroundColor: Colors.background,
        padding: Spacing.md,
        borderRadius: Radius.md,
        borderWidth: 1,
        borderColor: Colors.neutral300,
    },
    orientadorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    orientadorRegion: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.neutral900,
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        backgroundColor: Colors.white,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: Radius.sm,
        borderWidth: 1,
        borderColor: Colors.neutral300,
    },
    emailText: {
        fontSize: 14,
        color: Colors.blueAction,
        fontWeight: '500',
    },
    emailSub: {
        fontSize: 11,
        color: Colors.neutral500,
        marginTop: Spacing.sm,
    },
});
