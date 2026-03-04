import { useRouter } from 'expo-router';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../constants/theme';
import type { UserProfile } from '../types';
import { useProfile } from './context';



interface FieldMeta {
  key: keyof Omit<UserProfile, 'primeraGen'>;
  label: string;
  placeholder: string;
  hint: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  optional?: boolean;
}

const FIELDS: FieldMeta[] = [
  {
    key: 'nombre',
    label: '¿Cómo te llamamos?',
    placeholder: 'Tu nombre',
    hint: 'Solo para personalizar la app.',
    keyboardType: 'default',
  },
  {
    key: 'nem',
    label: 'NEM (Notas de Enseñanza Media)',
    placeholder: 'Ej: 5.8',
    hint: 'Tu promedio de notas de 1° a 4° medio, en escala 1.0 a 7.0. Lo encuentras en tu certificado de notas.',
    keyboardType: 'decimal-pad',
  },
  {
    key: 'ranking',
    label: 'Ranking',
    placeholder: 'Ej: 680',
    hint: 'Puntaje de 100 a 1000. Premia tu rendimiento relativo dentro de tu colegio. Lo entrega el DEMRE junto a los resultados PAES.',
    keyboardType: 'numeric',
  },
  {
    key: 'lc',
    label: 'PAES: Competencia Lectora',
    placeholder: 'Ej: 620',
    hint: 'Prueba obligatoria. Escala 100 a 1000.',
    keyboardType: 'numeric',
  },
  {
    key: 'm1',
    label: 'PAES: Matemática 1',
    placeholder: 'Ej: 590',
    hint: 'Prueba obligatoria. Escala 100 a 1000.',
    keyboardType: 'numeric',
  },
  {
    key: 'm2',
    label: 'PAES: Matemática 2 (electiva)',
    placeholder: 'Ej: 550 — dejar vacío si no rendiste',
    hint: 'Prueba electiva requerida por algunas carreras de ingeniería, matemáticas y economía.',
    keyboardType: 'numeric',
    optional: true,
  },
  {
    key: 'ciencias',
    label: 'PAES: Ciencias (electiva)',
    placeholder: 'Ej: 610 — dejar vacío si no rendiste',
    hint: 'Exigida por carreras de salud, biología, química y afines.',
    keyboardType: 'numeric',
    optional: true,
  },
  {
    key: 'historia',
    label: 'PAES: Historia y Cs. Sociales (electiva)',
    placeholder: 'Ej: 580 — dejar vacío si no rendiste',
    hint: 'Exigida por pedagogías, trabajo social, derecho y ciencias sociales.',
    keyboardType: 'numeric',
    optional: true,
  },
  {
    key: 'rsh',
    label: '% Registro Social de Hogares (RSH)',
    placeholder: 'Ej: 45',
    hint: 'Número del 0 al 100. Determina si accedes a Gratuidad (≤60%) y Becas (≤70%). Lo puedes verificar en registrosocial.gob.cl con tu RUT.',
    keyboardType: 'numeric',
  },
  {
    key: 'region',
    label: 'Región donde vives',
    placeholder: 'Ej: Metropolitana, Valparaíso…',
    hint: 'Sirve para filtrar instituciones y calcular si aplican beneficios regionales.',
    keyboardType: 'default',
  },
];

const WHY_REGISTER = [
  {
    icon: '📊',
    title: 'Calcular tu puntaje ponderado real',
    desc: 'Cada carrera usa coeficientes distintos para NEM, Ranking y PAES. Te mostramos el puntaje exacto que cada carrera ve.',
  },
  {
    icon: '💰',
    title: 'Saber qué becas te corresponden',
    desc: 'El RSH y tus puntajes determinan si calificas para Gratuidad, Bicentenario, Nuevo Milenio u otros beneficios.',
  },
  {
    icon: '🎯',
    title: 'Filtrar carreras alcanzables',
    desc: 'Con tu perfil real comparamos tu puntaje contra el corte histórico de cada carrera y te mostramos el semáforo de probabilidad.',
  },
];



export default function WelcomeScreen() {
  const { setProfile } = useProfile();
  const router = useRouter();
  const [profile, setLocalProfile] = useState<UserProfile>({
    nombre: '', nem: '', ranking: '', lc: '', m1: '',
    m2: '', ciencias: '', historia: '',
    rsh: '', region: '', primeraGen: false,
  });
  const [error, setError] = useState('');

  const update = (key: keyof UserProfile, value: string | boolean) => {
    setLocalProfile(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const validate = (): boolean => {
    const required: (keyof UserProfile)[] = ['nombre', 'nem', 'ranking', 'lc', 'm1', 'rsh', 'region'];
    for (const k of required) {
      if (!profile[k] || String(profile[k]).trim() === '') {
        setError(`El campo "${FIELDS.find(f => f.key === k)?.label ?? k}" es obligatorio.`);
        return false;
      }
    }
    const nem = parseFloat(profile.nem);
    if (isNaN(nem) || nem < 1 || nem > 7) {
      setError('El NEM debe estar entre 1.0 y 7.0.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      setProfile(profile);
      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.emoji}>🎓</Text>
          <Text style={styles.heroTitle}>Rediseño Activo 2026</Text>
          <Text style={styles.heroSub}>
            Tu guía personalizada para el ingreso a la educación superior en Chile 2026
          </Text>
        </View>

        {/* Por qué registrarse */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Por qué ingresamos tus datos?</Text>
          <Text style={styles.sectionBody}>
            Sin tus puntajes reales, solo podemos mostrarte información genérica. Con ellos, la app se convierte en un asesor personalizado:
          </Text>
          {WHY_REGISTER.map((item, i) => (
            <View key={i} style={styles.whyCard}>
              <Text style={styles.whyIcon}>{item.icon}</Text>
              <View style={styles.whyText}>
                <Text style={styles.whyTitle}>{item.title}</Text>
                <Text style={styles.whyDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Por qué el diagnóstico */}
        <View style={[styles.section, styles.infoBanner]}>
          <View style={styles.infoRow}>
            <Info size={18} color={Colors.primary} style={styles.infoIcon} />
            <Text style={styles.infoTitle}>¿Por qué hacemos el diagnóstico?</Text>
          </View>
          <Text style={styles.infoBody}>
            El sistema de acceso chileno combina NEM, Ranking y PAES con ponderaciones específicas por carrera.
            El RSH determina si calificas para Gratuidad o Becas estatales.
            El diagnóstico nos permite mostrarte solo las opciones realistas para tu perfil, ahorrándote tiempo y evitando falsas expectativas.
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu perfil académico</Text>

          {FIELDS.map(field => (
            <View key={field.key} style={styles.fieldContainer}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {field.optional && (
                  <Text style={styles.optionalTag}>Electiva</Text>
                )}
              </View>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor={Colors.neutral300}
                keyboardType={field.keyboardType ?? 'default'}
                value={profile[field.key] as string}
                onChangeText={v => update(field.key, v)}
                returnKeyType="next"
              />
              <Text style={styles.fieldHint}>{field.hint}</Text>
            </View>
          ))}

          {/* Primera generación */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleText}>
              <Text style={styles.fieldLabel}>¿Primera generación universitaria?</Text>
              <Text style={styles.fieldHint}>
                Si ninguno de tus padres o tutores completó la educación superior, algunos programas tienen beneficios adicionales para ti.
              </Text>
            </View>
            <Switch
              value={profile.primeraGen}
              onValueChange={v => update('primeraGen', v)}
              trackColor={{ false: Colors.neutral300, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>
        </View>

        {/* Error */}
        {!!error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} onPress={handleSubmit} activeOpacity={0.85}>
          <Text style={styles.ctaText}>Comenzar mi camino</Text>
          <ArrowRight size={20} color={Colors.white} />
        </TouchableOpacity>

        {/* Privacidad */}
        <View style={styles.privacyNote}>
          <CheckCircle2 size={14} color={Colors.neutral500} />
          <Text style={styles.privacyText}>
            Tus datos se guardan solo en tu dispositivo. No se envían a ningún servidor.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f1f5f9', maxWidth: 600, alignSelf: 'center', width: '100%' },
  scroll: { flex: 1 },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },

  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  emoji: { fontSize: 52 },
  heroTitle: { ...Typography.h1, textAlign: 'center' },
  heroSub: {
    ...Typography.body,
    textAlign: 'center',
    color: Colors.neutral500,
    maxWidth: 300,
  },

  section: {
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionTitle: { ...Typography.h2, marginBottom: Spacing.xs },
  sectionBody: { ...Typography.body, lineHeight: 22 },

  whyCard: {
    flexDirection: 'row',
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
  whyIcon: { fontSize: 26, marginTop: 2 },
  whyText: { flex: 1, gap: 4 },
  whyTitle: { ...Typography.h3, fontSize: 14 },
  whyDesc: { ...Typography.bodySmall, lineHeight: 18 },

  infoBanner: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.xs },
  infoIcon: {},
  infoTitle: { ...Typography.h3, color: Colors.primary },
  infoBody: { ...Typography.body, lineHeight: 22, color: Colors.neutral700 },

  fieldContainer: { marginBottom: Spacing.md },
  fieldHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.xs },
  fieldLabel: { ...Typography.label },
  optionalTag: {
    fontSize: 11,
    color: Colors.neutral500,
    backgroundColor: Colors.neutral100,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.neutral300,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.neutral900,
    backgroundColor: Colors.white,
  },
  fieldHint: {
    ...Typography.bodySmall,
    lineHeight: 18,
    marginTop: 4,
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  toggleText: { flex: 1, gap: 4 },

  errorBanner: {
    backgroundColor: Colors.dangerBg,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.danger,
  },
  errorText: { ...Typography.body, color: Colors.danger },

  ctaButton: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    justifyContent: 'center',
  },
  privacyText: { ...Typography.bodySmall, color: Colors.neutral500 },
});

