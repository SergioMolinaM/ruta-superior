import React, { useState } from 'react';

const CatalogoBeneficios = () => {
  const [filtro, setFiltro] = useState('Todos');

  const beneficios = [
    {
      id: 1,
      tipo: 'Gratuidad',
      nombre: 'Gratuidad',
      cubre: 'Matrícula + arancel regulado anual completo',
      dirigido: 'Estudiantes del 60% menores ingresos (RSH)',
      inst: 'Solo en IES adscritas a gratuidad',
      alerta: 'Si la institución no está adscrita, este beneficio NO aplica.',
      link: 'https://beneficiosestudiantiles.cl',
      iconClass: 'icon-green'
    },
    {
      id: 2,
      tipo: 'Beca',
      nombre: 'Beca Bicentenario',
      cubre: 'Arancel de referencia anual completo',
      dirigido: '70% menores ingresos + 510 pts PAES',
      inst: 'Solo Universidades acreditadas',
      link: 'https://beneficiosestudiantiles.cl',
      iconClass: 'icon-blue'
    },
    {
      id: 3,
      tipo: 'Beca',
      nombre: 'Beca Juan Gómez Millas',
      cubre: 'Hasta $1.150.000 del arancel anual',
      dirigido: '70% menores ingresos + 510 pts PAES',
      inst: 'Cualquier institución acreditada',
      link: 'https://beneficiosestudiantiles.cl',
      iconClass: 'icon-blue'
    },
    {
      id: 4,
      tipo: 'Crédito',
      nombre: 'CAE (Crédito con Garantía Estatal)',
      cubre: 'Hasta el 100% del arancel de referencia',
      dirigido: 'Sin restricción de decil (evaluación anual)',
      inst: 'Instituciones acreditadas por la CNA',
      link: 'https://ingresa.cl',
      iconClass: 'icon-yellow'
    },
    {
      id: 5,
      tipo: 'Beca',
      nombre: 'Beca Nuevo Milenio',
      cubre: 'Desde $600.000 hasta $860.000 anuales',
      dirigido: '70% menores ingresos + Nota E. Media 5.0',
      inst: 'Institutos Profesionales y CFT',
      link: 'https://beneficiosestudiantiles.cl',
      iconClass: 'icon-blue'
    }
  ];

  const beneficiosFiltrados = filtro === 'Todos' 
    ? beneficios 
    : beneficios.filter(b => b.tipo === filtro);

  return (
    <div className="section-card">
      {/* HEADER DEL CATÁLOGO */}
      <div className="section-head">
        <div className="section-icon icon-green">💰</div>
        <div className="section-head-text">
          <div className="section-ttl">Catálogo de Ayudas Estatales</div>
          <div className="section-sub">Becas, gratuidad y créditos para el proceso 2026</div>
        </div>
      </div>

      {/* PESTAÑAS DE FILTRADO */}
      <div className="tabs-row" style={{ padding: '0.75rem 1.25rem', backgroundColor: '#f8f9fc', borderBottom: '1px solid #f0f2f7' }}>
        {['Todos', 'Gratuidad', 'Beca', 'Crédito'].map(cat => (
          <button 
            key={cat}
            className={`tab-btn ${filtro === cat ? 'active' : ''}`}
            onClick={() => setFiltro(cat)}
          >
            {cat === 'Todos' ? 'Todos' : cat + 's'}
          </button>
        ))}
      </div>

      {/* GRILLA DE TARJETAS */}
      <div className="ay-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', padding: '1.25rem' }}>
        {beneficiosFiltrados.map((b) => (
          <div key={b.id} className="ay-card benefit-card">
            <div className="ay-card-hdr" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div className="ay-nombre" style={{ fontWeight: '700', color: '#0f2547', fontSize: '1rem' }}>{b.nombre}</div>
              <span className={`badge ${b.tipo === 'Gratuidad' ? 'b-grat' : b.tipo === 'Beca' ? 'b-beca' : 'b-cred'}`}>
                {b.tipo}
              </span>
            </div>

            <div className="ay-cubre" style={{ color: '#059669', fontWeight: '600', fontSize: '0.85rem', marginBottom: '8px' }}>
              ✓ {b.cubre}
            </div>

            <div className="ay-req" style={{ fontSize: '0.8rem', color: '#5a6478', marginBottom: '5px' }}>
              <strong>Dirigido a:</strong> {b.dirigido}
            </div>

            <div className="ay-inst" style={{ fontSize: '0.8rem', color: '#0f1623', fontWeight: '500', marginBottom: '10px' }}>
              🏛 {b.inst}
            </div>

            {b.alerta && (
              <div className="ay-alerta" style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '8px', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '12px', borderLeft: '3px solid #f59e0b' }}>
                ⚠️ {b.alerta}
              </div>
            )}

            <a 
              href={b.link} 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary" 
              style={{ width: '100%', textAlign: 'center', marginTop: 'auto', textDecoration: 'none', display: 'block', padding: '10px', fontSize: '0.8rem' }}
            >
              Ver requisitos completos →
            </a>
          </div>
        ))}
      </div>

      <div className="ay-foot" style={{ padding: '1rem', fontSize: '0.7rem', color: '#9aa3b8', borderTop: '1px solid #f0f2f7', textAlign: 'center' }}>
        Recuerda que todos estos beneficios se solicitan completando el <strong>FUAS</strong> en las fechas oficiales.
      </div>
    </div>
  );
};

export default CatalogoBeneficios;