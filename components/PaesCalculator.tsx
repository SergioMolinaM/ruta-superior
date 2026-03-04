import { Info } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CARRERAS, COSTOS_PAES, REQUISITOS_PEDAGOGIA } from '../constants/data';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import type { Carrera, UserProfile } from '../types';

interface PaesCalculatorProps {
  profile: UserProfile;
  onBack?: () => void;
}

type Tab = 'ponderado' | 'brecha';

function calcPonderado(carrera: Carrera, profile: UserProfile): number {
  const c = carrera.coeficientes;
  const nem = parseFloat(profile.nem) || 0;
  const ranking = parseInt(profile.ranking) || 0;
  const lc = parseInt(profile.lc) || 0;
  const m1 = parseInt(profile.m1) || 0;
  const m2 = parseInt(profile.m2) || 0;
  const ciencias = parseInt(profile.ciencias) || 0;
  const historia = parseInt(profile.historia) || 0;
  // NEM se convierte a escala 100-1000 mediante tabla oficial.
  // Aproximación: NEM * 100 (simplificada, la tabla real es no lineal).
  const nemPts = nem * 100;
  return Math.round(
    nemPts * c.nem +
    ranking * c.ranking +
    lc * c.lc +
    m1 * c.m1 +
    m2 * c.m2 +
    ciencias * c.ciencias +
    historia * c.historia
  );
}

function Semaforo({ puntaje, corte }: { puntaje: number; corte: number }) {
  if (puntaje <= 0 || corte <= 0) return null;
  const diff = puntaje - corte;
  const color = diff >= 20 ? Colors.secondary : diff >= -30 ? Colors.warning : Colors.danger;
  const label = diff >= 20 ? '✅ Por sobre el corte' : diff >= -30 ? '🟡 Zona de riesgo' : '🔴 Bajo el corte';
  const desc =
    diff >= 20
      ? `+${diff} pts sobre el corte 2024`
      : diff >= -30
        ? `${Math.abs(diff)} pts del corte 2024`
        : `${Math.abs(diff)} pts bajo el corte 2024`;
  return (
    <View style={[styles.semaforo, { borderColor: color, backgroundColor: color + '18' }]}>
      <Text style={[styles.semaforoLabel, { color }]}>{label}</Text>
      <Text style={[styles.semaforoDesc, { color }]}>{desc}</Text>
    </View>
  );
}

export default function PaesCalculator({ profile, onBack }: PaesCalculatorProps) {
  const [tab, setTab] = useState<Tab>('ponderado');
  const [selectedCarrera, setSelectedCarrera] = useState<Carrera | null>(null);

  // Brecha financiera
  const [arancelReal, setArancelReal] = useState('');
  const [arancelRef, setArancelRef] = useState('');

  const ponderado = selectedCarrera ? calcPonderado(selectedCarrera, profile) : 0;

  const brechaVal =
    arancelReal && arancelRef
      ? parseInt(arancelReal.replace(/\D/g, '')) - parseInt(arancelRef.replace(/\D/g, ''))
      : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver al Dashboard</Text>
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Simulador PAES</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === 'ponderado' && styles.tabActive]}
          onPress={() => setTab('ponderado')}
        >
          <Text style={[styles.tabText, tab === 'ponderado' && styles.tabTextActive]}>
            Puntaje ponderado
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === 'brecha' && styles.tabActive]}
          onPress={() => setTab('brecha')}
        >
          <Text style={[styles.tabText, tab === 'brecha' && styles.tabTextActive]}>
            Brecha financiera
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Puntaje ponderado ── */}
      {tab === 'ponderado' && (
        <View style={styles.section}>
          <Text style={styles.sectionDesc}>
            Selecciona una carrera para ver cuánto pesas con tus puntajes actuales y compararlos con el corte histórico.
          </Text>

          <Text style={styles.label}>Seleccionar carrera</Text>
          {CARRERAS.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.carreraOption,
                selectedCarrera?.id === c.id && styles.carreraOptionSelected,
              ]}
              onPress={() => setSelectedCarrera(c)}
            >
              <View style={styles.carreraRow}>
                <View style={styles.carreraInfo}>
                  <Text style={styles.carreraNombre}>{c.nombre}</Text>
                  <Text style={styles.carreraInst}>{c.institucion}</Text>
                </View>
                <Text style={styles.carreraCorte}>Corte 2024: {c.corte2024 || 'N/A'}</Text>
              </View>
            </TouchableOpacity>
          ))}

          {selectedCarrera && (
            <View style={styles.resultCard}>
              <Text style={styles.resultTitle}>{selectedCarrera.nombre}</Text>
              <Text style={styles.resultInst}>{selectedCarrera.institucion}</Text>

              <View style={styles.coefGrid}>
                {Object.entries(selectedCarrera.coeficientes)
                  .filter(([, v]) => v > 0)
                  .map(([k, v]) => (
                    <View key={k} style={styles.coefChip}>
                      <Text style={styles.coefKey}>{k.toUpperCase()}</Text>
                      <Text style={styles.coefVal}>{Math.round(v * 100)}%</Text>
                    </View>
                  ))}
              </View>

              <View style={styles.ponderadoResult}>
                <Text style={styles.ponderadoLabel}>Tu puntaje ponderado</Text>
                <Text style={styles.ponderadoNum}>{ponderado > 0 ? ponderado : '—'}</Text>
              </View>

              <Semaforo puntaje={ponderado} corte={selectedCarrera.corte2024} />

              <Text style={styles.nota}>
                ⚠️ NEM convertido con aproximación lineal. El resultado oficial usa la tabla DEMRE.
              </Text>
            </View>
          )}

          {/* Habilitación pedagogías */}
          <View style={styles.infoBanner}>
            <Info size={16} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Habilitación para Pedagogías</Text>
              <Text style={styles.infoBody}>{REQUISITOS_PEDAGOGIA.descripcion}</Text>
            </View>
          </View>

          {/* Costos PAES */}
          <View style={styles.costosCard}>
            <Text style={styles.costosTitle}>Costos de inscripción PAES 2026</Text>
            <View style={styles.costoRow}>
              <Text style={styles.costoLabel}>1 prueba</Text>
              <Text style={styles.costoVal}>${COSTOS_PAES.unaPrueba.toLocaleString('es-CL')}</Text>
            </View>
            <View style={styles.costoRow}>
              <Text style={styles.costoLabel}>2 pruebas</Text>
              <Text style={styles.costoVal}>${COSTOS_PAES.dosPruebas.toLocaleString('es-CL')}</Text>
            </View>
            <View style={styles.costoRow}>
              <Text style={styles.costoLabel}>3 o más pruebas</Text>
              <Text style={styles.costoVal}>${COSTOS_PAES.tresMas.toLocaleString('es-CL')}</Text>
            </View>
            <Text style={styles.costoNota}>{COSTOS_PAES.becaPAES}</Text>
          </View>
        </View>
      )}

      {/* ── Brecha financiera ── */}
      {tab === 'brecha' && (
        <View style={styles.section}>
          <View style={styles.infoBanner}>
            <Info size={16} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>¿Qué es la brecha financiera?</Text>
              <Text style={styles.infoBody}>
                Las becas y la Gratuidad financian hasta el <Text style={{ fontWeight: '700' }}>Arancel de Referencia</Text> fijado por el MINEDUC.
                Si el Arancel Real de la carrera es mayor, la diferencia (brecha) puede quedar a tu cargo.
                {'\n\n'}Brecha = Arancel Real − Arancel de Referencia
              </Text>
            </View>
          </View>

          <Text style={styles.label}>Arancel Real anual (lo publica cada institución)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 4500000"
            keyboardType="numeric"
            value={arancelReal}
            onChangeText={setArancelReal}
            placeholderTextColor={Colors.neutral300}
          />

          <Text style={styles.label}>Arancel de Referencia anual (portal MINEDUC)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 3467418"
            keyboardType="numeric"
            value={arancelRef}
            onChangeText={setArancelRef}
            placeholderTextColor={Colors.neutral300}
          />

          {brechaVal !== null && (
            <View style={[
              styles.brechaResult,
              { borderLeftColor: brechaVal > 0 ? Colors.danger : Colors.secondary }
            ]}>
              <Text style={styles.brechaLabel}>Brecha anual</Text>
              <Text style={[
                styles.brechaNum,
                { color: brechaVal > 0 ? Colors.danger : Colors.secondary }
              ]}>
                {brechaVal > 0
                  ? `$${brechaVal.toLocaleString('es-CL')} a tu cargo`
                  : `Sin brecha ✅`}
              </Text>
              {brechaVal > 0 && (
                <Text style={styles.brechaNote}>
                  Considera si puedes complementar con CAE o recursos propios. El CAE cubre solo hasta el arancel de referencia.
                </Text>
              )}
            </View>
          )}

          {/* Ejemplos del brief */}
          <Text style={styles.sectionTitle}>Ejemplos reales (proceso 2024)</Text>
          {CARRERAS.filter(c => c.arancelReferencia > 0).slice(0, 5).map(c => {
            const brecha = c.arancel - c.arancelReferencia;
            return (
              <View key={c.id} style={styles.ejemploRow}>
                <View style={styles.ejemploInfo}>
                  <Text style={styles.ejemploNombre}>{c.nombre}</Text>
                  <Text style={styles.ejemploInst}>{c.institucion}</Text>
                </View>
                <View style={styles.ejemploMontos}>
                  <Text style={styles.ejemploReal}>${(c.arancel / 1000000).toFixed(1)}M</Text>
                  <Text style={[styles.ejemploBrecha, { color: brecha > 0 ? Colors.danger : Colors.secondary }]}>
                    {brecha > 0 ? `+$${(brecha / 1000).toFixed(0)}K brecha` : 'Sin brecha'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  header: {
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    ...Typography.h1,
  },

  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.neutral100,
    borderRadius: Radius.md,
    padding: 4,
    marginBottom: Spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: Radius.sm,
  },
  tabActive: { backgroundColor: Colors.white, ...Shadow.card },
  tabText: { fontSize: 13, fontWeight: '600', color: Colors.neutral500 },
  tabTextActive: { color: Colors.primary },

  section: { gap: Spacing.md },
  sectionDesc: { ...Typography.body, lineHeight: 22 },
  sectionTitle: { ...Typography.h3, marginTop: Spacing.xs },
  label: { ...Typography.label, marginBottom: Spacing.xs },

  carreraOption: {
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Shadow.card,
  },
  carreraOptionSelected: { borderColor: Colors.primary },
  carreraRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  carreraInfo: { flex: 1 },
  carreraNombre: { ...Typography.h3, fontSize: 14 },
  carreraInst: { ...Typography.bodySmall, marginTop: 2 },
  carreraCorte: { ...Typography.bodySmall, color: Colors.primary, fontWeight: '600' },

  resultCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  resultTitle: { ...Typography.h2 },
  resultInst: { ...Typography.body, color: Colors.neutral500 },
  coefGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  coefChip: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  coefKey: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  coefVal: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  ponderadoResult: { alignItems: 'center', paddingVertical: Spacing.sm },
  ponderadoLabel: { ...Typography.bodySmall, color: Colors.neutral500 },
  ponderadoNum: { fontSize: 42, fontWeight: '800', color: Colors.primary },
  semaforo: {
    borderRadius: Radius.sm,
    borderWidth: 1,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  semaforoLabel: { fontWeight: '700', fontSize: 15 },
  semaforoDesc: { fontSize: 13 },
  nota: { ...Typography.bodySmall, color: Colors.neutral500 },

  infoBanner: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoText: { flex: 1 },
  infoTitle: { ...Typography.label, color: Colors.primary, marginBottom: 4 },
  infoBody: { ...Typography.body, lineHeight: 22, color: Colors.neutral700 },

  costosCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    ...Shadow.card,
  },
  costosTitle: { ...Typography.h3 },
  costoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  costoLabel: { ...Typography.body },
  costoVal: { ...Typography.body, fontWeight: '700', color: Colors.primary },
  costoNota: { ...Typography.bodySmall, color: Colors.secondary, marginTop: 4 },

  input: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.neutral900,
    backgroundColor: Colors.white,
    marginBottom: Spacing.sm,
  },

  brechaResult: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderLeftWidth: 4,
    padding: Spacing.md,
    gap: 4,
    ...Shadow.card,
  },
  brechaLabel: { ...Typography.bodySmall, color: Colors.neutral500 },
  brechaNum: { fontSize: 22, fontWeight: '800' },
  brechaNote: { ...Typography.bodySmall, lineHeight: 18, marginTop: 4 },

  ejemploRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    ...Shadow.card,
  },
  ejemploInfo: { flex: 1 },
  ejemploNombre: { ...Typography.label, fontSize: 13 },
  ejemploInst: { ...Typography.bodySmall },
  ejemploMontos: { alignItems: 'flex-end' },
  ejemploReal: { ...Typography.body, fontWeight: '600' },
  ejemploBrecha: { fontSize: 12, fontWeight: '600' },
});
