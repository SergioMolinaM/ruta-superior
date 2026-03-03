import { CheckCircle2, X } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Radius, Spacing } from '../constants/theme';
import type { Carrera } from '../types';

interface ComparadorProps {
    carreras: Carrera[];
    onClose: () => void;
    onRemove: (id: string) => void;
}

export default function ComparadorCarreras({ carreras, onClose, onRemove }: ComparadorProps) {
    if (carreras.length === 0) {
        return (
            <View style={styles.emptyWrap}>
                <View style={styles.headerRow}>
                    <Text style={styles.title}>Comparador ({carreras.length}/3)</Text>
                    <TouchableOpacity onPress={onClose}><X color={Colors.neutral700} /></TouchableOpacity>
                </View>
                <Text style={styles.emptyText}>Selecciona hasta 3 carreras para comparar aranceles, duración y empleabilidad.</Text>
            </View>
        );
    }

    const aranceles = carreras.map(c => c.arancel || Infinity);
    const minArancel = Math.min(...aranceles);

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Comparador ({carreras.length}/3)</Text>
                <TouchableOpacity onPress={onClose}><X color={Colors.neutral700} /></TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
                {carreras.map((c) => {
                    const esBarato = c.arancel === minArancel && carreras.length > 1;

                    return (
                        <View key={c.id} style={[styles.card, esBarato && styles.cardHighlight]}>
                            <TouchableOpacity style={styles.removeBtn} onPress={() => onRemove(c.id)}>
                                <X size={16} color={Colors.neutral500} />
                            </TouchableOpacity>

                            <Text style={styles.institucion} numberOfLines={1}>{c.institucion}</Text>
                            <Text style={styles.carrera} numberOfLines={2}>{c.nombre}</Text>

                            {esBarato && (
                                <View style={styles.badgeSuccess}>
                                    <CheckCircle2 size={12} color={Colors.successText} />
                                    <Text style={styles.badgeText}>Arancel más bajo</Text>
                                </View>
                            )}

                            <View style={styles.statsWrap}>
                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Arancel Anual:</Text>
                                    <Text style={[styles.statValue, esBarato && { color: Colors.successText, fontWeight: '700' }]}>
                                        ${c.arancel?.toLocaleString('es-CL') || 'N/A'}
                                    </Text>
                                </View>

                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Duración:</Text>
                                    <Text style={styles.statValue}>{c.duracion} semestres</Text>
                                </View>

                                <View style={styles.statRow}>
                                    <Text style={styles.statLabel}>Acreditación:</Text>
                                    <Text style={styles.statValue}>{c.acreditacion} años</Text>
                                </View>
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    emptyWrap: {
        backgroundColor: Colors.white,
        padding: Spacing.lg,
        borderTopLeftRadius: Radius.lg,
        borderTopRightRadius: Radius.lg,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.neutral500,
        marginTop: Spacing.md,
        fontSize: 14,
    },
    container: {
        backgroundColor: Colors.background,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.xxl,
        borderTopLeftRadius: Radius.lg,
        borderTopRightRadius: Radius.lg,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.navy,
    },
    scroll: {
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
    },
    card: {
        width: 260,
        backgroundColor: Colors.white,
        borderRadius: Radius.md,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.neutral300,
        position: 'relative',
    },
    cardHighlight: {
        borderColor: Colors.successText,
        borderWidth: 2,
        backgroundColor: Colors.successBg + '10', // Ligero tinte verde
    },
    removeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
        backgroundColor: Colors.neutral100,
        borderRadius: Radius.full,
        zIndex: 10,
    },
    institucion: {
        fontSize: 12,
        color: Colors.neutral500,
        fontWeight: '600',
        marginTop: Spacing.sm,
        textTransform: 'uppercase',
    },
    carrera: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.neutral900,
        marginTop: 2,
        marginBottom: Spacing.sm,
        height: 44, // Fija altura para 2 líneas
    },
    badgeSuccess: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.successBg,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: Radius.full,
        alignSelf: 'flex-start',
        gap: 4,
        marginBottom: Spacing.sm,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.successText,
        textTransform: 'uppercase',
    },
    statsWrap: {
        backgroundColor: Colors.neutral100,
        borderRadius: Radius.sm,
        padding: Spacing.sm,
        gap: 6,
        marginTop: 'auto',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: Colors.neutral500,
    },
    statValue: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.navy,
    },
});
