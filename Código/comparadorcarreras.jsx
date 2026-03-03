import React from 'react';

const ComparadorCarreras = ({ selectedCarreras = [] }) => {
  
  // 1. Lógica para encontrar el arancel más bajo y destacar la mejor opción
  const aranceles = selectedCarreras.map(c => c.arancel_anual_2026 || Infinity);
  const minArancel = Math.min(...aranceles);

  // Si no hay nada seleccionado, mostramos el estado vacío amigable
  if (selectedCarreras.length === 0) {
    return (
      <div className="section-card animate-in" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'dashed' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚖️</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Selecciona hasta <strong>3 carreras</strong> en la tabla superior para comparar aranceles, duración y empleabilidad.
        </p>
      </div>
    );
  }

  return (
    <div className="section-card animate-in">
      <div className="section-head">
        <div className="section-icon icon-blue">⚖️</div>
        <div className="section-head-text">
          <div className="section-ttl">Comparativa de Opciones</div>
          <div className="section-sub">Análisis directo de costos y beneficios para tu futuro</div>
        </div>
      </div>

      <div className="comparison-grid" style={styles.grid}>
        {selectedCarreras.map((carrera) => {
          const esMasBarato = carrera.arancel_anual_2026 === minArancel && selectedCarreras.length > 1;

          return (
            <div key={carrera.id_carrera} className="comp-column" style={styles.column}>
              {/* Encabezado de la Carrera */}
              <div style={styles.header}>
                <div style={styles.carreraTitle}>{carrera.nombre_carrera}</div>
                <div style={styles.instTitle}>{carrera.institucion}</div>
              </div>

              {/* Arancel (Con destaque si es el más bajo) */}
              <div style={{ ...styles.row, ...(esMasBarato ? styles.highlightRow : {}) }}>
                <span style={styles.label}>Arancel Anual 2026</span>
                <span style={{ ...styles.value, color: esMasBarato ? 'var(--success)' : 'inherit' }}>
                  ${Math.round(carrera.arancel_anual_2026).toLocaleString('es-CL')}
                  {esMasBarato && <small style={styles.bestTag}>★ MEJOR PRECIO</small>}
                </span>
              </div>

              {/* Duración Real */}
              <div style={styles.row}>
                <span style={styles.label}>Duración Real</span>
                <span style={styles.value}>
                  {carrera.duracion_real_sem || carrera.duracion_formal_sem} semestres
                </span>
              </div>

              {/* Empleabilidad */}
              <div style={styles.row}>
                <span style={styles.label}>Empleabilidad 1er año</span>
                <span style={styles.value}>{carrera.empleabilidad_1er_anio || 'Sin datos'}</span>
              </div>

              {/* Acreditación */}
              <div style={styles.row}>
                <span style={styles.label}>Nivel Acreditación</span>
                <div style={{ marginTop: '5px' }}>
                  <span className={`badge ${carrera.nivel_cna === 'Excelencia' ? 'b-exc' : 'b-ava'}`}>
                    {carrera.nivel_cna}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Estilos internos para mantener la estructura de tabla comparativa
const styles = {
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1px',
    backgroundColor: 'var(--border-gray)', // Crea las líneas divisorias
  },
  column: {
    flex: '1 1 250px',
    backgroundColor: 'var(--white)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '1.5rem',
    backgroundColor: 'var(--bg-gray)',
    borderBottom: '2px solid var(--accent-blue)',
    minHeight: '100px',
  },
  carreraTitle: {
    fontWeight: '800',
    color: 'var(--primary-navy)',
    fontSize: '0.95rem',
    lineHeight: '1.2',
  },
  instTitle: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '5px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  row: {
    padding: '1.2rem 1.5rem',
    borderBottom: '1px solid var(--border-gray)',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  label: {
    fontSize: '0.65rem',
    fontWeight: '700',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  value: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  highlightRow: {
    backgroundColor: '#f0fdf4', // Verde muy tenue
  },
  bestTag: {
    backgroundColor: 'var(--success)',
    color: 'white',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '0.6rem',
  }
};

export default ComparadorCarreras;