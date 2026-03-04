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
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Saludo */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hola, {profile.nombre || 'estudiante'} 👋</Text>
          <Text style={styles.subtitle}>Tu resumen académico y metas clave</Text>
        </View>

        {/* Alerta FUAS */}
        <View style={styles.alertBanner}>
          <Bell size={20} color={Colors.warning} />
          <View style={styles.alertText}>
            <Text style={styles.alertTitle}>Formulario FUAS Pendiente</Text>
            <Text style={styles.alertDesc}>
              Postula a Gratuidad y Becas en portal.becasycreditos.cl antes del 12 de marzo.
            </Text>
          </View>
        </View>

        {/* Perfil diagnóstico */}
        <View style={[styles.card, { borderLeftColor: perfil.color, borderLeftWidth: 4 }]}>
          <Text style={styles.cardLabel}>TU DIAGNÓSTICO FINANCIERO</Text>
          <Text style={[styles.perfilTitulo, { color: perfil.color }]}>{perfil.titulo}</Text>
          <Text style={styles.perfilDesc}>{perfil.desc}</Text>
        </View>

        {/* Resumen de puntajes */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>TU PROGRESO ACADÉMICO</Text>
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
          <View style={styles.divider} />
          <Text style={styles.puntajeEst}>
            Puntaje base orientativo: <Text style={styles.puntajeNum}>{puntajeEst > 0 ? puntajeEst : '—'}</Text>
          </Text>
          <Text style={styles.puntajeNote}>
            Calculado con ponderación promedio. Cada carrera aplica sus propios coeficientes.
          </Text>
        </View>

        {/* Acciones rápidas (Movidas arriba para jerarquía visual) */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          <QuickAction emoji="🔍" title="Explorador" desc="Simular puntajes" onPress={() => onNavigate('carreras')} />
          <QuickAction emoji="💰" title="Beneficios" desc="Catálogo estatal" onPress={() => onNavigate('beneficios')} />
          <QuickAction emoji="📅" title="Calendario" desc="Fechas clave" onPress={() => onNavigate('calendario')} />
          <QuickAction emoji="🧮" title="Calculadora" desc="Desglose total" onPress={() => onNavigate('paes')} />
        </View>

        {/* Vías de ingreso */}
        <Text style={styles.sectionTitle}>Vías de Admisión</Text>
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
            </View>
          </View>
        ))}
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
  scroll: { flex: 1, backgroundColor: Colors.slate50 },
  scrollContent: { paddingBottom: Spacing.xxl * 2, paddingTop: Spacing.md },
  container: { alignSelf: 'center', width: '100%', maxWidth: 448, paddingHorizontal: Spacing.md },

  header: { marginBottom: Spacing.xl },
  greeting: { ...Typography.h1, marginBottom: 4 },
  subtitle: { ...Typography.body, color: Colors.slate500 },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.warningBg,
    borderRadius: Radius.xl, // rounded-xl
    padding: Spacing.lg,     // p-6
    gap: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.warning,
    ...Shadow.sm,
  },
  alertText: { flex: 1, gap: 4 },
  alertTitle: { ...Typography.h3, fontSize: 15, color: Colors.warningText },
  alertDesc: { ...Typography.bodySmall, color: Colors.warningText, lineHeight: 20 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl, // rounded-2xl
    padding: Spacing.lg,     // p-6
    marginBottom: Spacing.lg,
    ...Shadow.md,            // shadow-md
    borderWidth: 1,
    borderColor: Colors.slate100, // border-slate-100
  },
  cardLabel: { ...Typography.label, color: Colors.slate400, marginBottom: Spacing.sm },
  perfilTitulo: { ...Typography.h2, marginBottom: Spacing.sm, fontSize: 18 },
  perfilDesc: { ...Typography.body, lineHeight: 24, color: Colors.slate600 },

  puntajesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  chip: {
    backgroundColor: Colors.slate50,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    minWidth: '30%',
    flexGrow: 1,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  chipHighlight: { backgroundColor: Colors.primaryLight, borderColor: Colors.primaryLight },
  chipLabel: { fontSize: 11, color: Colors.slate500, fontWeight: '600', textTransform: 'uppercase' },
  chipLabelHighlight: { color: Colors.primaryDark },
  chipValue: { fontSize: 16, fontWeight: '700', color: Colors.slate900, marginTop: 2 },
  chipValueHighlight: { color: Colors.primaryDark },

  divider: { height: 1, backgroundColor: Colors.slate100, marginVertical: Spacing.md },
  puntajeEst: { ...Typography.body, fontWeight: '600' },
  puntajeNum: { fontWeight: '800', color: Colors.primary, fontSize: 18 },
  puntajeNote: { ...Typography.bodySmall, color: Colors.slate400, marginTop: Spacing.xs },

  sectionTitle: { ...Typography.h2, marginBottom: Spacing.md, marginTop: Spacing.sm },

  viaCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl, // rounded-2xl
    padding: Spacing.lg,     // p-6
    marginBottom: Spacing.md,
    gap: Spacing.md,
    ...Shadow.md,            // shadow-md
    borderWidth: 1,
    borderColor: Colors.slate100,
  },
  viaIcon: { fontSize: 32, marginTop: 2 },
  viaText: { flex: 1, gap: Spacing.xs },
  viaNombre: { ...Typography.h3, color: Colors.slate900 },
  viaDesc: { ...Typography.body, lineHeight: 22 },
  viaRequisitos: { marginTop: Spacing.xs, gap: 4 },
  requisito: {},
  requisitoText: { ...Typography.bodySmall, lineHeight: 18, color: Colors.slate500 },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  quickAction: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl, // rounded-2xl
    padding: Spacing.lg,     // p-6
    alignItems: 'center',
    gap: Spacing.xs,
    ...Shadow.md,            // shadow-md
    borderWidth: 1,
    borderColor: Colors.slate100,
  },
  quickEmoji: { fontSize: 28, marginBottom: 4 },
  quickTitle: { ...Typography.h3, fontSize: 15, textAlign: 'center' },
  quickDesc: { ...Typography.bodySmall, textAlign: 'center' },
});
