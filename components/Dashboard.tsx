import { Bell, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CARRERAS_FULL, normalize, VIAS_INGRESO } from '../constants/data';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [showDebug, setShowDebug] = useState(false);

  const filteredCarreras = useMemo(() => {
    const q = normalize(searchQuery);
    return CARRERAS_FULL.filter(c => {
      if (!c) return false;
      const n = c.nombre_search || normalize(c.nombre);
      const inst = c.inst_search || normalize(c.institucion || c.universidad);
      const sede = c.sede_search || normalize(c.sede);
      return n.includes(q) || inst.includes(q) || sede.includes(q);
    }).slice(0, 20);
  }, [searchQuery]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Saludo */}
        <TouchableOpacity onPress={() => setShowDebug(!showDebug)}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hola, {profile.nombre || 'estudiante'} 👋</Text>
            <Text style={styles.subtitle}>Tu resumen académico y metas clave</Text>
          </View>
        </TouchableOpacity>

        {showDebug && (
          <View style={[styles.card, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
            <Text style={{ fontWeight: 'bold', color: '#991b1b', marginBottom: 8 }}>DIAGNÓSTICOS DEL SISTEMA</Text>
            <Text style={{ fontSize: 12, color: '#991b1b' }}>Registros totales: {CARRERAS_FULL.length}</Text>
            <Text style={{ fontSize: 12, color: '#991b1b' }}>Platform: {JSON.stringify(process.env.NODE_ENV)}</Text>
            <Text style={{ fontSize: 12, color: '#991b1b' }}>Prueba Periodismo: {CARRERAS_FULL.filter(c => c.nombre_search?.includes('periodismo')).length} encontrados</Text>
            <TouchableOpacity onPress={() => setShowDebug(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>Cerrar diagnóstico</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Acciones rápidas (Movidas arriba para jerarquía visual) */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          <QuickAction emoji="🔍" title="Explorador" desc="Simular puntajes" onPress={() => onNavigate('carreras')} />
          <QuickAction emoji="💰" title="Beneficios" desc="Catálogo estatal" onPress={() => onNavigate('beneficios')} />
          <QuickAction emoji="📅" title="Calendario" desc="Fechas clave" onPress={() => onNavigate('calendario')} />
          <QuickAction emoji="🧮" title="Calculadora" desc="Desglose total" onPress={() => onNavigate('paes')} />
        </View>

        {/* Buscador de Carreras */}
        <Text style={styles.sectionTitle}>Buscador de Carreras</Text>
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.neutral500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por carrera..."
            placeholderTextColor={Colors.neutral300}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View>
          {filteredCarreras.map((carrera: any) => {
            if (!carrera || !carrera.id) return null;
            return (
              <View key={carrera.id} style={styles.carreraCard}>
                <View style={{ flex: 1, marginRight: 12 }}>
                  <Text style={styles.carreraNombre} numberOfLines={2}>{carrera.nombre || 'Carrera sin nombre'}</Text>
                  <Text style={styles.carreraUniv}>
                    {carrera.institucion || carrera.universidad || 'Institución no disponible'}
                    {carrera.sede ? ` · ${carrera.sede}` : ''}
                  </Text>
                </View>
                <View style={styles.corteBadge}>
                  <Text style={styles.corteText}>
                    Corte: {carrera.puntaje_corte || carrera.corte2025 || carrera.corte2026 || carrera.corte2024 || 'N/A'}
                  </Text>
                </View>
              </View>
            );
          })}
          {filteredCarreras.length === 0 && searchQuery.trim() !== '' && (
            <Text style={styles.emptyText}>No se encontraron carreras con "{searchQuery}".</Text>
          )}
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
  scroll: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollContent: { paddingBottom: Spacing.xxl * 2, paddingTop: Spacing.md },
  container: { alignSelf: 'center', width: '100%', maxWidth: 600, paddingHorizontal: Spacing.md },

  header: { marginBottom: Spacing.xl },
  greeting: { ...Typography.h1, marginBottom: 4 },
  subtitle: { ...Typography.body, color: Colors.slate500 },

  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    gap: Spacing.md,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  alertText: { flex: 1, gap: 4 },
  alertTitle: { ...Typography.h3, fontSize: 15, color: Colors.warningText },
  alertDesc: { ...Typography.bodySmall, color: Colors.warningText, lineHeight: 20 },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
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
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  quickEmoji: { fontSize: 28, marginBottom: 4 },
  quickTitle: { ...Typography.h3, fontSize: 15, textAlign: 'center' },
  quickDesc: { ...Typography.bodySmall, textAlign: 'center' },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#0f172a' },

  skeletonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  skeletonTitle: { height: 20, width: '70%', backgroundColor: '#e2e8f0', borderRadius: 6, marginBottom: 8 },
  skeletonUniv: { height: 14, width: '40%', backgroundColor: '#e2e8f0', borderRadius: 4, marginBottom: 16 },
  skeletonBadge: { height: 26, width: 90, backgroundColor: '#f1f5f9', borderRadius: 12 },

  carreraCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  carreraNombre: { fontSize: 16, fontWeight: '700', color: '#2563eb', marginBottom: 6 },
  carreraUniv: { fontSize: 14, color: '#475569' },
  corteBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corteText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  emptyText: { textAlign: 'center', color: '#64748b', marginVertical: 16, fontSize: 14 },
});
