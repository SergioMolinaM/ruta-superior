import React, { useState } from 'react';

const RedApoyo = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('');

  // Datos de instituciones oficiales
  const canalesOficiales = [
    {
      nombre: 'DEMRE',
      subtitulo: 'Admisión y PAES',
      logo: '📝',
      link: 'https://demre.cl',
      color: '#e0f2fe'
    },
    {
      nombre: 'MINEDUC / FUAS',
      subtitulo: 'Becas y Gratuidad',
      logo: '🎓',
      link: 'https://beneficiosestudiantiles.cl',
      color: '#d1fae5'
    },
    {
      nombre: 'Comisión Ingresa',
      subtitulo: 'Crédito CAE',
      logo: '🏦',
      link: 'https://ingresa.cl',
      color: '#fef3c7'
    }
  ];

  // Datos de orientadores por zona
  const orientadores = {
    'Norte': { region: 'Arica a Coquimbo', email: 'orienta.norte@mineduc.cl' },
    'Centro': { region: 'Valparaíso a Maule', email: 'orienta.centro@mineduc.cl' },
    'Sur': { region: 'Ñuble a Magallanes', email: 'orienta.sur@mineduc.cl' }
  };

  return (
    <div className="section-card" style={{ marginTop: '20px' }}>
      {/* HEADER */}
      <div className="section-head">
        <div className="section-icon icon-blue">🤝</div>
        <div className="section-head-text">
          <div className="section-ttl">Red de Apoyo y Canales Oficiales</div>
          <div className="section-sub">Información verificada directamente desde organismos del Estado</div>
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* GRID DE CANALES OFICIALES */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px',
          marginBottom: '2rem' 
        }}>
          {canalesOficiales.map((canal, index) => (
            <div key={index} style={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              backgroundColor: 'white',
              transition: 'transform 0.2s'
            }} className="stat-card">
              <div style={{ 
                fontSize: '2rem', 
                backgroundColor: canal.color, 
                width: '60px', 
                height: '60px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 10px'
              }}>
                {canal.logo}
              </div>
              <div style={{ fontWeight: '800', color: '#0f2547', fontSize: '0.9rem' }}>{canal.nombre}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '15px' }}>{canal.subtitulo}</div>
              <a 
                href={canal.link} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
                style={{ fontSize: '0.75rem', width: '100%', justifyContent: 'center', textDecoration: 'none' }}
              >
                Ir al sitio oficial →
              </a>
            </div>
          ))}
        </div>

        {/* SECCIÓN ORIENTADORES POR ZONA */}
        <div style={{ 
          backgroundColor: '#f8f9fc', 
          borderRadius: '12px', 
          padding: '20px',
          border: '1px solid #e2e6ef'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ color: '#0f2547', fontSize: '0.95rem', fontWeight: '700' }}>📍 Orientadores por zona</h4>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Si necesitas ayuda personalizada de un humano, selecciona tu zona:</p>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              value={zonaSeleccionada}
              onChange={(e) => setZonaSeleccionada(e.target.value)}
              className="field"
              style={{ 
                padding: '10px', 
                borderRadius: '8px', 
                border: '1.5px solid #e2e6ef',
                minWidth: '200px',
                outline: 'none'
              }}
            >
              <option value="">-- Selecciona tu zona --</option>
              <option value="Norte">Zona Norte</option>
              <option value="Centro">Zona Centro</option>
              <option value="Sur">Zona Sur</option>
            </select>

            {zonaSeleccionada && (
              <div className="animate-in" style={{ 
                backgroundColor: 'white', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                borderLeft: '4px solid #1d5ce6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>
                  Contacto {zonaSeleccionada} ({orientadores[zonaSeleccionada].region})
                </div>
                <div style={{ fontWeight: '700', color: '#1d5ce6', fontSize: '0.9rem' }}>
                  {orientadores[zonaSeleccionada].email}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RedApoyo;