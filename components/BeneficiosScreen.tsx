import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, XCircle } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BENEFICIOS } from '../constants/data';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import type { Beneficio, UserProfile } from '../types';

interface BeneficiosScreenProps {
  profile: UserProfile;
  onBack?: () => void;
}

type CatFilter = 'Todos' | 'Gratuidad' | 'Beca' | 'Crédito' | 'Apoyo';

const CATS: CatFilter[] = ['Todos', 'Gratuidad', 'Beca', 'Crédito', 'Apoyo'];

function elegibilidad(b: Beneficio, profile: UserProfile): 'elegible' | 'posible' | 'no' {
  const rsh = parseInt(profile.rsh) || 100;
  const lc = parseInt(profile.lc) || 0;
  const m1 = parseInt(profile.m1) || 0;
  const prom = (lc + m1) / 2;
  const nem = parseFloat(profile.nem) || 0;

  const rshOk = rsh <= b.requisitosRSH;
  const puntajeOk = b.requisitoPuntaje === 0 || prom >= b.requisitoPuntaje;
  const nemOk = b.requisitoNEM === 0 || nem >= b.requisitoNEM;

  if (rshOk && puntajeOk && nemOk) return 'elegible';
  if (!rshOk && rsh <= b.requisitosRSH + 10) return 'posible';
  return 'no';
}

function ElegibilidadBadge({ estado }: { estado: 'elegible' | 'posible' | 'no' }) {
  const config = {
    elegible: { label: '✅ Probablemente elegible', color: Colors.secondary, bg: Colors.secondaryLight },
    posible: { label: '🟡 Verificar requisitos', color: Colors.warning, bg: Colors.warningLight },
    no: { label: '🔴 Fuera de rango', color: Colors.danger, bg: Colors.dangerLight },
  }[estado];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

export default function BeneficiosScreen({ profile, onBack }: BeneficiosScreenProps) {
  const [cat, setCat] = useState<CatFilter>('Todos');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () => BENEFICIOS.filter(b => cat === 'Todos' || b.categoria === cat),
    [cat]
  );

  const rsh = parseInt(profile.rsh) || 100;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver al Dashboard</Text>
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Beneficios Estudiantiles</Text>
      </View>

      {/* Banner FUAS */}
      <View style={styles.fuasBanner}>
        <AlertCircle size={18} color={Colors.warning} />
        <View style={styles.fuasText}>
          <Text style={styles.fuasTitle}>⏰ FUAS — 2° Período 2026</Text>
          <Text style={styles.fuasDesc}>
            Del 12 de febrero al 12 de marzo. Postula en portal.becasycreditos.cl. Es el único canal oficial para acceder a Gratuidad, Becas y Créditos.
          </Text>
        </View>
      </View>

      {/* Tu RSH */}
      <View style={styles.rshCard}>
        <Text style={styles.rshLabel}>Tu RSH</Text>
        <Text style={styles.rshNum}>{rsh}%</Text>
        <View style={styles.rshBar}>
          <View style={[styles.rshFill, { width: `${Math.min(rsh, 100)}%` }]} />
          <View style={[styles.rshMarker, { left: '60%' }]}>
            <Text style={styles.rshMarkerText}>60%{'\n'}Grat.</Text>
          </View>
          <View style={[styles.rshMarker, { left: '70%' }]}>
            <Text style={styles.rshMarkerText}>70%{'\n'}Becas</Text>
          </View>
        </View>
        <Text style={styles.rshNote}>
          {rsh <= 60
            ? '✅ Calificas para Gratuidad (RSH ≤ 60%) y Becas (RSH ≤ 70%)'
            : rsh <= 70
              ? '✅ Calificas para Becas (RSH ≤ 70%). Verifica Gratuidad.'
              : '⚠️ Tu RSH está fuera del rango de Gratuidad y Becas principales. Revisa Crédito CAE.'}
        </Text>
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

      {/* Lista */}
      {filtered.map(b => {
        const estado = elegibilidad(b, profile);
        const isOpen = expanded === b.id;
        return (
          <TouchableOpacity
            key={b.id}
            style={[styles.card, estado === 'elegible' && styles.cardElegible]}
            onPress={() => setExpanded(isOpen ? null : b.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleArea}>
                <View style={styles.catRow}>
                  <View style={[styles.catTag, { backgroundColor: getCatColor(b.categoria) + '20' }]}>
                    <Text style={[styles.catText, { color: getCatColor(b.categoria) }]}>{b.categoria}</Text>
                  </View>
                </View>
                <Text style={styles.benefNombre}>{b.nombre}</Text>
                <Text style={styles.benefResumen}>{b.resumen}</Text>
              </View>
              {isOpen ? <ChevronUp size={18} color={Colors.neutral500} /> : <ChevronDown size={18} color={Colors.neutral500} />}
            </View>

            <View style={styles.montoRow}>
              <Text style={styles.montoLabel}>Monto estimado:</Text>
              <Text style={styles.montoVal}>{b.montoEstimado}</Text>
            </View>

            <ElegibilidadBadge estado={estado} />

            {isOpen && (
              <View style={styles.detail}>
                <Text style={styles.detailSection}>Descripción</Text>
                <Text style={styles.detailBody}>{b.detalles}</Text>

                <Text style={styles.detailSection}>Requisitos</Text>
                {b.requisitosRSH < 100 && (
                  <ReqRow
                    label={`RSH ≤ ${b.requisitosRSH}%`}
                    ok={parseInt(profile.rsh) <= b.requisitosRSH}
                  />
                )}
                {b.requisitoPuntaje > 0 && (
                  <ReqRow
                    label={`Puntaje PAES ≥ ${b.requisitoPuntaje} pts`}
                    ok={(parseInt(profile.lc) + parseInt(profile.m1)) / 2 >= b.requisitoPuntaje}
                  />
                )}
                {b.requisitoNEM > 0 && (
                  <ReqRow
                    label={`Promedio NEM ≥ ${b.requisitoNEM}`}
                    ok={parseFloat(profile.nem) >= b.requisitoNEM}
                  />
                )}

                <Text style={styles.detailSection}>Instituciones elegibles</Text>
                <Text style={styles.detailBody}>{b.instituciones}</Text>

                {b.compatible.length > 0 && (
                  <>
                    <Text style={styles.detailSection}>Compatible con</Text>
                    <Text style={styles.detailBody}>
                      {b.compatible.map(id => BENEFICIOS.find(x => x.id === id)?.nombre ?? id).join(', ')}
                    </Text>
                  </>
                )}

                <Text style={styles.fuente}>Fuente: {b.fuente}</Text>

                {b.alerta && (
                  <View style={styles.alertRow}>
                    <AlertCircle size={14} color={Colors.warning} />
                    <Text style={styles.alertText}>{b.alerta}</Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <Text style={styles.disclaimer}>
        Los montos y requisitos corresponden al proceso 2026. Verifica siempre en beneficiosestudiantiles.cl y chileatiende.gob.cl.
      </Text>
    </ScrollView>
  );
}

function ReqRow({ label, ok }: { label: string; ok: boolean }) {
  return (
    <View style={styles.reqRow}>
      {ok
        ? <CheckCircle2 size={15} color={Colors.secondary} />
        : <XCircle size={15} color={Colors.danger} />}
      <Text style={[styles.reqText, { color: ok ? Colors.secondary : Colors.danger }]}>{label}</Text>
    </View>
  );
}

function getCatColor(cat: string): string {
  const map: Record<string, string> = {
    Gratuidad: Colors.secondary,
    Beca: Colors.primary,
    Crédito: Colors.warning,
    Apoyo: Colors.neutral700,
  };
  return map[cat] ?? Colors.neutral700;
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

  fuasBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  fuasText: { flex: 1 },
  fuasTitle: { ...Typography.label, color: Colors.warning, marginBottom: 2 },
  fuasDesc: { ...Typography.bodySmall, color: Colors.neutral700, lineHeight: 18 },

  rshCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.xs,
    ...Shadow.card,
  },
  rshLabel: { ...Typography.bodySmall, color: Colors.neutral500 },
  rshNum: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  rshBar: {
    height: 12,
    backgroundColor: Colors.neutral100,
    borderRadius: Radius.full,
    overflow: 'visible',
    marginVertical: Spacing.xs,
    position: 'relative',
  },
  rshFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    maxWidth: '100%',
  },
  rshMarker: {
    position: 'absolute',
    top: -4,
    alignItems: 'center',
  },
  rshMarkerText: { fontSize: 9, color: Colors.neutral500, textAlign: 'center', lineHeight: 12, marginTop: 14 },
  rshNote: { ...Typography.bodySmall, lineHeight: 18, marginTop: Spacing.xs },

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

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  cardElegible: { borderWidth: 1.5, borderColor: Colors.secondary + '60' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitleArea: { flex: 1, gap: 4 },
  catRow: { flexDirection: 'row' },
  catTag: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  catText: { fontSize: 11, fontWeight: '700' },
  benefNombre: { ...Typography.h3 },
  benefResumen: { ...Typography.body, lineHeight: 20 },

  montoRow: { flexDirection: 'row', gap: Spacing.xs, alignItems: 'center' },
  montoLabel: { ...Typography.bodySmall, color: Colors.neutral500 },
  montoVal: { ...Typography.label, color: Colors.neutral900 },

  badge: { paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.sm, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, fontWeight: '700' },

  detail: {
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    gap: Spacing.sm,
  },
  detailSection: { ...Typography.label, color: Colors.primary, marginTop: Spacing.xs },
  detailBody: { ...Typography.body, lineHeight: 22 },

  reqRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, paddingVertical: 2 },
  reqText: { ...Typography.body },

  fuente: { ...Typography.bodySmall, color: Colors.primary, marginTop: Spacing.xs },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs, marginTop: 4 },
  alertText: { ...Typography.bodySmall, color: Colors.warning, flex: 1, lineHeight: 18 },

  disclaimer: {
    ...Typography.bodySmall,
    color: Colors.neutral500,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 18,
  },
});
