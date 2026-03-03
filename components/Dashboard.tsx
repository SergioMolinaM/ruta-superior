import { Bell } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { VIAS_INGRESO } from '../constants/data';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import type { Screen, UserProfile } from '../types';

interface DashboardProps {
  profile: UserProfile;
  onNavigate: (screen: Screen) => void;
}

function getPerfil(profile: UserProfile): { titulo: string; desc: string; color: string } {
  const rsh = parseInt(profile.rsh) || 100;
  const lc = parseInt(profile.lc) || 0;
  const m1 = parseInt(profile.m1) || 0;
  const prom = (lc + m1) / 2;

  if (rsh <= 60 && prom >= 600) {
    return {
      titulo: 'Perfil Gratuidad + Alta Selectividad',
      desc: 'Calificas para Gratuidad y tienes puntajes que abren carreras de alta demanda. Enfócate en universidades del CRUCH y privadas adscritas a Gratuidad.',
      color: Colors.secondary,
    };
  }
  if (rsh <= 70 && prom >= 500) {
    return {
      titulo: 'Perfil Becas + Selectividad Media',
      desc: 'Calificas para Beca Bicentenario o Juan Gómez Millas. Tus puntajes acceden a una amplia oferta de carreras.',
      color: Colors.primary,
    };
  }
  if (rsh <= 70) {
    return {
      titulo: 'Perfil Becas + Fortalecimiento',
      desc: 'Puedes acceder a becas. Considera reforzar tus puntajes PAES para ampliar opciones o evaluar carreras técnico-profesionales.',
      color: Colors.warning,
    };
  }
  return {
    titulo: 'Perfil Crédito o Financiamiento Propio',
    desc: 'Tu RSH está fuera del rango de gratuidad y becas principales. Revisa el CAE y el Fondo Solidario como opciones de financiamiento.',
    color: Colors.neutral700,
  };
}

function calcPuntajeSimple(profile: UserProfile): number {
  const nem = parseFloat(profile.nem) || 0;
  const ranking = parseInt(profile.ranking) || 0;
  const lc = parseInt(profile.lc) || 0;
  const m1 = parseInt(profile.m1) || 0;
  // Ponderación estándar orientativa
  const nemPts = nem * 100 * 0.2;
  const rankPts = ranking * 0.2;
  const lcPts = lc * 0.3;
  const m1Pts = m1 * 0.3;
  return Math.round(nemPts + rankPts + lcPts + m1Pts);
}

export default function Dashboard({ profile, onNavigate }: DashboardProps) {
  const perfil = getPerfil(profile);
  const puntajeEst = calcPuntajeSimple(profile);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {/* Saludo */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {profile.nombre || 'estudiante'} 👋</Text>
        <Text style={styles.subtitle}>Proceso de Admisión 2026</Text>
      </View>

      {/* Alerta FUAS */}
      <View style={styles.alertBanner}>
        <Bell size={18} color={Colors.warning} />
        <View style={styles.alertText}>
          <Text style={styles.alertTitle}>⚠️ FUAS cierra el 12 de marzo 2026</Text>
          <Text style={styles.alertDesc}>
            Postula a Gratuidad y Becas en portal.becasycreditos.cl antes de que venza el plazo.
          </Text>
        </View>
      </View>

      {/* Perfil diagnóstico */}
      <View style={[styles.card, { borderLeftColor: perfil.color, borderLeftWidth: 4 }]}>
        <Text style={styles.cardLabel}>Tu diagnóstico</Text>
        <Text style={[styles.perfilTitulo, { color: perfil.color }]}>{perfil.titulo}</Text>
        <Text style={styles.perfilDesc}>{perfil.desc}</Text>
      </View>

      {/* Resumen de puntajes */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Resumen de puntajes</Text>
        <View style={styles.puntajesGrid}>
          <ScoreChip label="NEM" value={profile.nem || '—'} />
          <ScoreChip label="Ranking" value={profile.ranking || '—'} />
          <ScoreChip label="LC" value={profile.lc || '—'} />
          <ScoreChip label="M1" value={profile.m1 || '—'} />
          {profile.m2 ? <ScoreChip label="M2" value={profile.m2} /> : null}
          {profile.ciencias ? <ScoreChip label="Ciencias" value={profile.ciencias} /> : null}
          {profile.historia ? <ScoreChip label="Historia" value={profile.historia} /> : null}
          <ScoreChip label="RSH %" value={profile.rsh ? `${profile.rsh}%` : '—'} highlight />
        </View>
        <Text style={styles.puntajeEst}>
          Puntaje ponderado estimado (orientativo): <Text style={styles.puntajeNum}>{puntajeEst > 0 ? puntajeEst : '—'}</Text>
        </Text>
        <Text style={styles.puntajeNote}>
          El puntaje real varía según los coeficientes de cada carrera. Úsalo como referencia.
        </Text>
      </View>

      {/* Vías de ingreso */}
      <Text style={styles.sectionTitle}>Vías de ingreso disponibles</Text>
      {VIAS_INGRESO.map(via => (
        <View key={via.id} style={styles.viaCard}>
          <Text style={styles.viaIcon}>{via.icono}</Text>
          <View style={styles.viaText}>
            <Text style={styles.viaNombre}>{via.nombre}</Text>
            <Text style={styles.viaDesc}>{via.desc}</Text>
            <View style={styles.viaRequisitos}>
              {via.requisitos.map((r, i) => (
                <View key={i} style={styles.requisito}>
                  <Text style={styles.requisitoText}>• {r}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.viaFuente}>Fuente: {via.fuente}</Text>
          </View>
        </View>
      ))}

      {/* Acciones rápidas */}
      <Text style={styles.sectionTitle}>Explorar</Text>
      <View style={styles.actionsGrid}>
        <QuickAction
          emoji="🔍"
          title="Buscar carreras"
          desc="Con tu puntaje"
          onPress={() => onNavigate('carreras')}
        />
        <QuickAction
          emoji="💰"
          title="Ver becas"
          desc="Según tu RSH"
          onPress={() => onNavigate('beneficios')}
        />
        <QuickAction
          emoji="📅"
          title="Fechas clave"
          desc="2026"
          onPress={() => onNavigate('calendario')}
        />
        <QuickAction
          emoji="🧮"
          title="Calculadora"
          desc="Puntaje PAES"
          onPress={() => onNavigate('paes')}
        />
      </View>
    </ScrollView>
  );
}

function ScoreChip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.chip, highlight && styles.chipHighlight]}>
      <Text style={[styles.chipLabel, highlight && styles.chipLabelHighlight]}>{label}</Text>
      <Text style={[styles.chipValue, highlight && styles.chipValueHighlight]}>{value}</Text>
    </View>
  );
}

function QuickAction({ emoji, title, desc, onPress }: {
  emoji: string; title: string; desc: string; onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.quickEmoji}>{emoji}</Text>
      <Text style={styles.quickTitle}>{title}</Text>
      <Text style={styles.quickDesc}>{desc}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  header: { marginBottom: Spacing.lg },
  greeting: { ...Typography.h1, marginBottom: 4 },
  subtitle: { ...Typography.body, color: Colors.neutral500 },

  alertBanner: {
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
  alertText: { flex: 1 },
  alertTitle: { ...Typography.label, color: Colors.warning, marginBottom: 2 },
  alertDesc: { ...Typography.bodySmall, color: Colors.neutral700, lineHeight: 18 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.card,
  },
  cardLabel: { ...Typography.bodySmall, color: Colors.neutral500, marginBottom: 6 },
  perfilTitulo: { ...Typography.h3, marginBottom: 6 },
  perfilDesc: { ...Typography.body, lineHeight: 22 },

  puntajesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  chip: {
    backgroundColor: Colors.neutral100,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    minWidth: 62,
  },
  chipHighlight: { backgroundColor: Colors.primaryLight },
  chipLabel: { fontSize: 10, color: Colors.neutral500, fontWeight: '600' },
  chipLabelHighlight: { color: Colors.primary },
  chipValue: { fontSize: 14, fontWeight: '700', color: Colors.neutral900 },
  chipValueHighlight: { color: Colors.primary },
  puntajeEst: { ...Typography.bodySmall, marginTop: Spacing.xs },
  puntajeNum: { fontWeight: '700', color: Colors.primary },
  puntajeNote: { ...Typography.bodySmall, color: Colors.neutral500, marginTop: 2 },

  sectionTitle: { ...Typography.h3, marginBottom: Spacing.sm, marginTop: Spacing.xs },

  viaCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  viaIcon: { fontSize: 28, marginTop: 2 },
  viaText: { flex: 1, gap: 4 },
  viaNombre: { ...Typography.h3 },
  viaDesc: { ...Typography.body, lineHeight: 20 },
  viaRequisitos: { marginTop: 4 },
  requisito: {},
  requisitoText: { ...Typography.bodySmall, lineHeight: 18, color: Colors.neutral700 },
  viaFuente: { ...Typography.bodySmall, color: Colors.primary, marginTop: 4 },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickAction: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: 4,
    ...Shadow.card,
  },
  quickEmoji: { fontSize: 24 },
  quickTitle: { ...Typography.h3, fontSize: 14 },
  quickDesc: { ...Typography.bodySmall },
});
