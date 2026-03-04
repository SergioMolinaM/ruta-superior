import { ExternalLink } from 'lucide-react-native';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CALENDARIO } from '../constants/data';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import type { CalendarioItem, UserProfile } from '../types';

type CatFilter = 'Todos' | 'PAES' | 'Postulacion' | 'Becas' | 'Resultados' | 'Matricula';

const CATS: CatFilter[] = ['Todos', 'PAES', 'Becas', 'Postulacion', 'Resultados', 'Matricula'];

const CAT_COLORS: Record<string, string> = {
  PAES: Colors.primary,
  Postulacion: '#7C3AED',
  Becas: Colors.secondary,
  Resultados: '#DB2777',
  Matricula: Colors.warning,
};

function estadoLabel(estado: CalendarioItem['estado']): { label: string; color: string } {
  return {
    pasado: { label: 'Pasado', color: Colors.neutral500 },
    activo: { label: '🔴 Activo ahora', color: Colors.danger },
    pendiente: { label: 'Próximo', color: Colors.primary },
  }[estado];
}

interface CalendarioScreenProps {
  profile: UserProfile;
  onBack?: () => void;
}

export default function CalendarioScreen({ onBack }: CalendarioScreenProps) {
  const [cat, setCat] = useState<CatFilter>('Todos');

  const filtered = CALENDARIO.filter(e => cat === 'Todos' || e.categoria === cat);
  const activos = filtered.filter(e => e.estado === 'activo');
  const pendientes = filtered.filter(e => e.estado === 'pendiente');
  const pasados = filtered.filter(e => e.estado === 'pasado');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver al Dashboard</Text>
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Calendario Admisión 2026</Text>
      </View>

      {/* Filtros */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {CATS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.filterChip, cat === c && styles.filterChipActive]}
            onPress={() => setCat(c)}
          >
            <Text style={[styles.filterText, cat === c && styles.filterTextActive]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activos */}
      {activos.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>🔴 En curso ahora</Text>
          {activos.map(e => <EventCard key={e.id} event={e} />)}
        </>
      )}

      {/* Próximos */}
      {pendientes.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Próximas fechas</Text>
          {pendientes.map(e => <EventCard key={e.id} event={e} />)}
        </>
      )}

      {/* Pasados */}
      {pasados.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Fechas pasadas</Text>
          {pasados.map(e => <EventCard key={e.id} event={e} />)}
        </>
      )}

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sin eventos en esta categoría.</Text>
        </View>
      )}

      {/* Info costos PAES */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Costos inscripción PAES 2026</Text>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>1 prueba</Text>
          <Text style={styles.costVal}>$16.650</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>2 pruebas</Text>
          <Text style={styles.costVal}>$30.475</Text>
        </View>
        <View style={styles.costRow}>
          <Text style={styles.costLabel}>3 o más pruebas</Text>
          <Text style={styles.costVal}>$44.300</Text>
        </View>
        <Text style={styles.costNote}>
          Estudiantes de colegios con subvención estatal pueden solicitar la Beca PAES para eximirse del pago.
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        Fechas sujetas a actualización oficial por el MINEDUC y DEMRE. Verifica en acceso.mineduc.cl y demre.cl.
      </Text>
    </ScrollView>
  );
}

function EventCard({ event }: { event: CalendarioItem }) {
  const est = estadoLabel(event.estado);
  const catColor = CAT_COLORS[event.categoria] ?? Colors.neutral700;

  return (
    <View style={[
      styles.eventCard,
      event.estado === 'activo' && styles.eventCardActive,
      event.estado === 'pasado' && styles.eventCardPasado,
    ]}>
      <View style={styles.eventHeader}>
        <View style={styles.eventMeta}>
          <View style={[styles.catDot, { backgroundColor: catColor }]} />
          <Text style={[styles.catLabel, { color: catColor }]}>{event.categoria}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={[styles.estadoLabel, { color: est.color }]}>{est.label}</Text>
        </View>
        {event.link && (
          <TouchableOpacity
            onPress={() => Linking.openURL(`https://${event.link}`).catch(() => { })}
            style={styles.linkBtn}
          >
            <ExternalLink size={14} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.eventMes, { color: event.estado === 'pasado' ? Colors.neutral500 : Colors.neutral900 }]}>
        {event.mes}
      </Text>
      <Text style={[styles.eventTitulo, { color: event.estado === 'pasado' ? Colors.neutral500 : Colors.neutral900 }]}>
        {event.titulo}
      </Text>
      <Text style={[styles.eventDesc, { color: event.estado === 'pasado' ? Colors.neutral300 : Colors.neutral700 }]}>
        {event.desc}
      </Text>
      {event.link && (
        <Text style={styles.eventLink}>{event.link}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  header: { marginBottom: Spacing.xl },
  backButton: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: { ...Typography.h1, marginBottom: 8 },

  filters: { marginBottom: Spacing.md },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.neutral300,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, color: Colors.neutral700, fontWeight: '500' },
  filterTextActive: { color: Colors.white, fontWeight: '700' },

  sectionTitle: { ...Typography.h3, marginBottom: Spacing.sm, marginTop: Spacing.xs },

  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: 4,
    ...Shadow.card,
  },
  eventCardActive: {
    borderWidth: 2,
    borderColor: Colors.danger + '60',
    backgroundColor: Colors.dangerLight,
  },
  eventCardPasado: { opacity: 0.65 },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  catLabel: { fontSize: 11, fontWeight: '700' },
  dot: { color: Colors.neutral300, fontSize: 11 },
  estadoLabel: { fontSize: 11, fontWeight: '600' },
  linkBtn: { padding: 4 },

  eventMes: { fontSize: 12, fontWeight: '600', color: Colors.neutral500 },
  eventTitulo: { ...Typography.h3 },
  eventDesc: { ...Typography.body, lineHeight: 20 },
  eventLink: { ...Typography.bodySmall, color: Colors.primary, marginTop: 4 },

  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyText: { ...Typography.body, color: Colors.neutral500 },

  infoBox: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.xs,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoTitle: { ...Typography.h3, color: Colors.primary, marginBottom: Spacing.xs },
  costRow: { flexDirection: 'row', justifyContent: 'space-between' },
  costLabel: { ...Typography.body },
  costVal: { ...Typography.body, fontWeight: '700', color: Colors.primary },
  costNote: { ...Typography.bodySmall, color: Colors.neutral700, lineHeight: 18, marginTop: 4 },

  disclaimer: {
    ...Typography.bodySmall,
    color: Colors.neutral500,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 18,
  },
});
