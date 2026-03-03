import React, { useState } from 'react';

const SimuladorBeneficios = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    decil: '',
    tipo: '',
    acreditada: '',
    adscrita: ''
  });

  const totalSteps = 4;

  const handleSelect = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (step < totalSteps) {
      setTimeout(() => setStep(step + 1), 300); // Salto automático suave
    } else {
      setStep(5); // Ir a resultados
    }
  };

  const reset = () => {
    setFormData({ decil: '', tipo: '', acreditada: '', adscrita: '' });
    setStep(1);
  };

  // Lógica de cálculo basada en criterios oficiales (Mineduc 2026)
  const renderResult = () => {
    const { decil, acreditada, adscrita } = formData;
    const dNum = parseInt(decil);

    if (acreditada === 'no') {
      return (
        <div style={styles.resultCard(false)}>
          <h3 style={{ color: '#991b1b' }}>⚠️ Sin Beneficios Estatales</h3>
          <p>Si la institución no está acreditada, no puedes usar Gratuidad, Becas ni CAE. Considera buscar una opción acreditada.</p>
        </div>
      );
    }

    if (dNum <= 6 && adscrita === 'si') {
      return (
        <div style={styles.resultCard(true)}>
          <h3 style={{ color: '#065f46' }}>✨ ¡Alta Probabilidad de Gratuidad!</h3>
          <p>Tu decil ({decil}) y la institución cumplen los requisitos para cubrir matrícula y arancel completo por la duración nominal de la carrera.</p>
        </div>
      );
    }

    if (dNum <= 7) {
      return (
        <div style={styles.resultCard(true, '#eff6ff', '#2463eb')}>
          <h3 style={{ color: '#1e40af' }}>🎓 Beca Juan Gómez Millas + CAE</h3>
          <p>No accedes a gratuidad, pero calificas para becas de arancel y el Crédito con Garantía Estatal (CAE) para cubrir la diferencia.</p>
        </div>
      );
    }

    return (
      <div style={styles.resultCard(true, '#fff7ed', '#ea580c')}>
        <h3 style={{ color: '#9a3412' }}>🏦 Cobertura vía CAE</h3>
        <p>Por tu nivel de ingresos, el principal beneficio disponible es el CAE, el cual financia hasta el arancel de referencia de tu carrera.</p>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* BARRA DE PROGRESO */}
      {step <= totalSteps && (
        <div style={styles.progressContainer}>
          <div style={styles.progressBar(step, totalSteps)}></div>
          <p style={styles.stepIndicator}>Paso {step} de {totalSteps}</p>
        </div>
      )}

      {/* CONTENIDO DEL WIZARD */}
      <div style={styles.card}>
        {step === 1 && (
          <div className="animate-in">
            <h2 style={styles.title}>¿En qué decil socioeconómico está tu hogar?</h2>
            <p style={styles.subtitle}>Esto se basa en tu Registro Social de Hogares.</p>
            <div style={styles.grid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(d => (
                <button key={d} onClick={() => handleSelect('decil', d)} style={styles.optionBtn}>
                  Decil {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in">
            <h2 style={styles.title}>¿Qué tipo de institución te interesa?</h2>
            <div style={styles.column}>
              {['Universidad', 'Instituto Profesional (IP)', 'Centro de Formación Técnica (CFT)'].map(t => (
                <button key={t} onClick={() => handleSelect('tipo', t)} style={styles.optionBtnWide}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in">
            <h2 style={styles.title}>¿La institución está acreditada por la CNA?</h2>
            <div style={styles.row}>
              <button onClick={() => handleSelect('acreditada', 'si')} style={styles.optionBtnHalf}>Sí</button>
              <button onClick={() => handleSelect('acreditada', 'no')} style={styles.optionBtnHalf}>No</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in">
            <h2 style={styles.title}>¿La institución está adscrita a Gratuidad?</h2>
            <div style={styles.row}>
              <button onClick={() => handleSelect('adscrita', 'si')} style={styles.optionBtnHalf}>Sí</button>
              <button onClick={() => handleSelect('adscrita', 'no')} style={styles.optionBtnHalf}>No</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in" style={{ textAlign: 'center' }}>
            <h2 style={styles.title}>Resultado de tu Simulación</h2>
            {renderResult()}
            <button onClick={reset} style={styles.resetBtn}>Nueva Simulación</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ESTILOS (Integrados para coherencia visual rápida)
const styles = {
  container: { maxWidth: '600px', margin: '20px auto', padding: '0 20px' },
  progressContainer: { marginBottom: '20px' },
  progressBar: (step, total) => ({
    height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px',
    overflow: 'hidden', position: 'relative',
    '&::after': {
      content: '""', position: 'absolute', left: 0, top: 0,
      height: '100%', width: `${(step / total) * 100}%`,
      backgroundColor: '#2463eb', transition: 'width 0.3s ease'
    }
  }),
  stepIndicator: { fontSize: '0.8rem', color: '#64748b', marginTop: '8px', textAlign: 'right' },
  card: {
    backgroundColor: 'white', borderRadius: '12px', padding: '30px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', border: '1px solid #e2e8f0'
  },
  title: { fontSize: '1.25rem', color: '#0f2547', marginBottom: '10px', fontWeight: '700' },
  subtitle: { fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' },
  column: { display: 'flex', flexDirection: 'column', gap: '10px' },
  row: { display: 'flex', gap: '10px' },
  optionBtn: {
    padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
    backgroundColor: 'white', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.2s'
  },
  optionBtnWide: {
    padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0',
    backgroundColor: 'white', textAlign: 'left', cursor: 'pointer', fontSize: '1rem'
  },
  optionBtnHalf: { flex: 1, padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer' },
  resultCard: (success, bg = '#f0fdf4', border = '#10b981') => ({
    backgroundColor: bg, border: `2px solid ${border}`, padding: '20px',
    borderRadius: '10px', marginTop: '20px', textAlign: 'left'
  }),
  resetBtn: {
    marginTop: '20px', padding: '10px 20px', borderRadius: '8px',
    border: 'none', backgroundColor: '#0f2547', color: 'white', cursor: 'pointer'
  }
};

export default SimuladorBeneficios;