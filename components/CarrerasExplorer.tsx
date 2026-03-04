import { Check, Layers, Plus, Search, X } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CARRERAS } from '../constants/data';
import { Colors, Radius, Shadow, Spacing, Typography } from '../constants/theme';
import type { Carrera, UserProfile } from '../types';
import ComparadorCarreras from './ComparadorCarreras';

interface CarrerasExplorerProps {
  profile: UserProfile;
  onBack?: () => void;
}

const AREAS = ['Todas', 'Salud', 'Tecnología', 'Negocios', 'Derecho', 'Educación', 'Ciencias Sociales'];
const TIPOS = ['Todas', 'Universidad', 'IP', 'CFT'];

function calcPonderado(carrera: Carrera, profile: UserProfile): number {
  const c = carrera.coeficientes;
  const nem = parseFloat(profile.nem) || 0;
  const ranking = parseInt(profile.ranking) || 0;
  const lc = parseInt(profile.lc) || 0;
  const m1 = parseInt(profile.m1) || 0;
  const m2 = parseInt(profile.m2) || 0;
  const ciencias = parseInt(profile.ciencias) || 0;
  const historia = parseInt(profile.historia) || 0;
  const nemPts = nem * 100;
  return Math.round(
    nemPts * c.nem + ranking * c.ranking + lc * c.lc +
    m1 * c.m1 + m2 * c.m2 + ciencias * c.ciencias + historia * c.historia
  );
}

function SemaforoTag({ puntaje, corte }: { puntaje: number; corte: number }) {
  if (puntaje <= 0 || corte <= 0) return <View style={[styles.tag, { backgroundColor: Colors.slate100 }]}><Text style={styles.tagText}>IP/CFT</Text></View>;
  const diff = puntaje - corte;
  const bg = diff >= 20 ? Colors.secondaryLight : diff >= -30 ? Colors.warningBg : Colors.dangerBg;
  const color = diff >= 20 ? Colors.secondary : diff >= -30 ? Colors.warning : Colors.danger;
  const label = diff >= 20 ? '✅ Alcanzable' : diff >= -30 ? '🟡 Límite' : '🔴 Difícil';
  return <View style={[styles.tag, { backgroundColor: bg }]}><Text style={[styles.tagText, { color }]}>{label}</Text></View>;
}

export default function CarrerasExplorer({ profile, onBack }: CarrerasExplorerProps) {
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('Todas');
  const [tipo, setTipo] = useState('Todas');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showComparador, setShowComparador] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const filtered = useMemo(() => {
    return CARRERAS.filter(c => {
      const n = c?.nombre ? String(c.nombre).toLowerCase() : '';
      const inst = c?.institucion ? String(c.institucion).toLowerCase() : (c?.universidad ? String(c.universidad).toLowerCase() : '');
      const searchLower = query.toLowerCase();
      const matchQuery =
        query === '' ||
        n.includes(searchLower) ||
        inst.includes(searchLower);
      const matchArea = area === 'Todas' || c.area === area;
      const matchTipo = tipo === 'Todas' || c.tipo === tipo;
      return matchQuery && matchArea && matchTipo;
    });
  }, [query, area, tipo]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>← Volver al Dashboard</Text>
        </TouchableOpacity>
      )}
      <View style={styles.header}>
        <Text style={styles.title}>Explorador de Carreras</Text>

        {/* Buscador */}
        <View style={styles.searchBox}>
          <Search size={18} color={Colors.neutral500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar carrera o institución…"
            placeholderTextColor={Colors.neutral300}
            value={query}
            onChangeText={setQuery}
          />
          {query !== '' && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={16} color={Colors.neutral500} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros área */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {AREAS.map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.filterChip, area === a && styles.filterChipActive]}
            onPress={() => setArea(a)}
          >
            <Text style={[styles.filterText, area === a && styles.filterTextActive]}>{a}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Filtros tipo */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {TIPOS.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.filterChip, tipo === t && styles.filterChipActive]}
            onPress={() => setTipo(t)}
          >
            <Text style={[styles.filterText, tipo === t && styles.filterTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.resultCount}>{filtered.length} carrera{filtered.length !== 1 ? 's' : ''}</Text>

      {filtered.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Sin resultados. Ajusta los filtros.</Text>
        </View>
      )}

      {filtered.map(carrera => {
        const ponderado = calcPonderado(carrera, profile);
        const isOpen = expanded === carrera.id;
        return (
          <TouchableOpacity
            key={carrera.id}
            style={styles.card}
            onPress={() => setExpanded(isOpen ? null : carrera.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleArea}>
                <Text style={styles.carreraNombre}>{carrera.nombre}</Text>
                <Text style={styles.carreraInst}>{carrera.universidad || carrera.institucion} · {carrera.tipo || 'Universidad'}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: Spacing.xs }}>
                <SemaforoTag puntaje={ponderado} corte={carrera.puntaje_corte || carrera.corte2025 || carrera.corte2024} />
                <TouchableOpacity
                  style={[styles.selectBtn, selectedIds.includes(carrera.id) && styles.selectBtnActive]}
                  onPress={() => toggleSelect(carrera.id)}
                >
                  {selectedIds.includes(carrera.id) ? <Check size={14} color={Colors.white} /> : <Plus size={14} color={Colors.primary} />}
                  <Text style={[styles.selectBtnText, selectedIds.includes(carrera.id) && { color: Colors.white }]}>
                    {selectedIds.includes(carrera.id) ? 'Añadida' : 'Comparar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cardMeta}>
              <MetaChip label="Área" value={carrera.area} />
              <MetaChip label="Región" value={carrera.region} />
              <MetaChip label="Duración" value={carrera.duracion} />
              {carrera.gratuidad && <MetaChip label="Gratuidad" value="✅" highlight />}
            </View>

            {isOpen && (
              <View style={styles.cardDetail}>
                <DetailRow label="Puntaje ponderado estimado" value={ponderado > 0 ? String(ponderado) : 'N/A'} highlight />
                <DetailRow label="Puntaje de Corte" value={(carrera.puntaje_corte ?? 0) > 0 ? String(carrera.puntaje_corte) : (carrera.corte2025 ?? 0) > 0 ? String(carrera.corte2025) : (carrera.corte2024 ?? 0) > 0 ? String(carrera.corte2024) : 'N/A'} />
                <DetailRow label="Corte 2023" value={carrera.corte2023 > 0 ? String(carrera.corte2023) : 'N/A'} />
                <DetailRow label="Vacantes" value={String(carrera.vacantes)} />
                <DetailRow label="Grado" value={carrera.grado} />
                <DetailRow label="Arancel real anual" value={`$${(carrera.arancel / 1000000).toFixed(2)}M`} />
                <DetailRow
                  label="Brecha estimada"
                  value={carrera.arancel - carrera.arancelReferencia > 0
                    ? `$${((carrera.arancel - carrera.arancelReferencia) / 1000).toFixed(0)}K`
                    : 'Sin brecha'}
                  danger={carrera.arancel - carrera.arancelReferencia > 500000}
                />
                <DetailRow label="Acreditación" value={`${carrera.acreditacion} años`} />

                <Text style={styles.coefTitle}>Ponderaciones</Text>
                <View style={styles.coefGrid}>
                  {Object.entries(carrera.coeficientes)
                    .filter(([, v]) => v > 0)
                    .map(([k, v]) => (
                      <View key={k} style={styles.coefChip}>
                        <Text style={styles.coefKey}>{k.toUpperCase()}</Text>
                        <Text style={styles.coefVal}>{Math.round(v * 100)}%</Text>
                      </View>
                    ))}
                </View>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      {selectedIds.length > 0 && (
        <TouchableOpacity style={styles.fabCompare} onPress={() => setShowComparador(true)}>
          <Layers color={Colors.white} size={20} />
          <Text style={{ color: Colors.white, fontWeight: '700', marginLeft: 8 }}>
            Ver Comparador ({selectedIds.length}/3)
          </Text>
        </TouchableOpacity>
      )}

      <Modal visible={showComparador} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalDismiss} activeOpacity={1} onPress={() => setShowComparador(false)} />
          <ComparadorCarreras
            carreras={CARRERAS.filter(c => selectedIds.includes(c.id))}
            onClose={() => setShowComparador(false)}
            onRemove={toggleSelect}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

function MetaChip({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.metaChip, highlight && styles.metaChipHighlight]}>
      <Text style={[styles.metaLabel, highlight && styles.metaLabelHighlight]}>{label}: </Text>
      <Text style={[styles.metaValue, highlight && styles.metaValueHighlight]}>{value}</Text>
    </View>
  );
}

function DetailRow({ label, value, highlight, danger }: { label: string; value: string; highlight?: boolean; danger?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[
        styles.detailValue,
        highlight && { color: Colors.primary, fontWeight: '700' },
        danger && { color: Colors.danger, fontWeight: '700' },
      ]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#f1f5f9' },
  scrollContent: { padding: Spacing.md, paddingBottom: Spacing.xxl + 80 },
  header: { marginBottom: Spacing.md },
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

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.xl, // rounded-2xl
    paddingHorizontal: Spacing.md,
    paddingVertical: 12, // slightly taller
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadow.md, // shadow-md
    borderWidth: 1,
    borderColor: Colors.slate100,
  },
  searchInput: { flex: 1, fontSize: 16, color: Colors.slate900 },

  filters: { marginBottom: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.slate200,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 13, color: Colors.slate600, fontWeight: '500' },
  filterTextActive: { color: Colors.white, fontWeight: '700' },

  resultCount: { ...Typography.bodySmall, marginBottom: Spacing.sm, color: Colors.slate500 },

  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyText: { ...Typography.body, color: Colors.slate500 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl, // rounded-2xl
    padding: Spacing.lg,     // p-6
    marginBottom: Spacing.md,
    ...Shadow.md,            // shadow-md
    borderWidth: 1,
    borderColor: Colors.slate100,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: Spacing.sm },
  cardTitleArea: { flex: 1 },
  carreraNombre: { ...Typography.h3 },
  carreraInst: { ...Typography.bodySmall, marginTop: 2 },

  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm },
  tagText: { fontSize: 11, fontWeight: '700' },

  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, marginTop: Spacing.sm },
  metaChip: { flexDirection: 'row', backgroundColor: Colors.neutral100, borderRadius: Radius.sm, paddingHorizontal: 6, paddingVertical: 3 },
  metaChipHighlight: { backgroundColor: Colors.secondaryLight },
  metaLabel: { fontSize: 11, color: Colors.neutral500 },
  metaLabelHighlight: { color: Colors.secondary },
  metaValue: { fontSize: 11, fontWeight: '600', color: Colors.neutral700 },
  metaValueHighlight: { color: Colors.secondary },

  cardDetail: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral100,
    gap: Spacing.xs,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  detailLabel: { ...Typography.body, color: Colors.neutral500 },
  detailValue: { ...Typography.body, color: Colors.neutral900 },
  coefTitle: { ...Typography.label, marginTop: Spacing.sm },
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

  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    gap: 4,
  },
  selectBtnActive: {
    backgroundColor: Colors.primary,
  },
  selectBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
  },

  fabCompare: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg, // slightly thicker
    borderRadius: Radius.full,
    ...Shadow.lg, // strong shadow
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalDismiss: {
    flex: 1,
  },
});
