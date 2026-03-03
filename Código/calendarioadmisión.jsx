import React, { useState, useEffect } from 'react';

const CalendarioAdmision = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendario = async () => {
      try {
        const response = await fetch('https://caminoalau-api.onrender.com/calendario');
        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error("Error cargando el calendario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendario();
  }, []);

  // Lógica para formatear fechas y detectar si es "Próximo"
  const processDate = (fechaStr) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaEvt = new Date(fechaStr + 'T00:00:00'); // Evita desfase de zona horaria
    
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const dia = fechaEvt.getDate().toString().padStart(2, '0');
    const mes = meses[fechaEvt.getMonth()];

    // Es "Próximo" si es en el futuro y dentro de los próximos 30 días
    const diffTime = fechaEvt - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const esProximo = diffDays >= 0 && diffDays <= 30;
    const esPasado = diffDays < 0;

    return { dia, mes, esProximo, esPasado };
  };

  if (loading) return <div className="cal-list">Cargando cronograma oficial...</div>;

  return (
    <div className="section-card">
      <div className="section-head">
        <div className="section-icon icon-purple">📅</div>
        <div className="section-head-text">
          <div className="section-ttl">Calendario Oficial 2026</div>
          <div className="section-sub">Fechas clave del DEMRE y Mineduc</div>
        </div>
      </div>

      <div className="cal-list" style={{ padding: '1.25rem' }}>
        {eventos.map((evt, index) => {
          const { dia, mes, esProximo, esPasado } = processDate(evt.s);
          
          // Mapeo de colores de categorías de tu CSS original
          const badgeClass = {
            'PAES': 'cat-paes',
            'FUAS': 'cat-fuas',
            'Matrícula': 'cat-mat',
            'CAE': 'cat-cae'
          }[evt.cat] || 'b-sd';

          return (
            <div key={index} className={`evt-card ${esPasado ? 'past' : ''} date-card`}>
              {/* Bloque de Fecha */}
              <div className="evt-fecha">
                <span className="evt-dia">{dia}</span>
                <span className="evt-mes">{mes}</span>
              </div>

              {/* Contenido del Evento */}
              <div className="evt-body">
                <div className="evt-badges">
                  <span className={`badge ${badgeClass}`}>{evt.cat}</span>
                  {esProximo && <span className="badge-prox">⚡ Próximo</span>}
                </div>
                
                <div className={`evt-titulo ${esPasado ? 'past-txt' : ''}`}>
                  {evt.titulo}
                </div>
                
                {evt.desc && <div className="evt-desc">{evt.desc}</div>}
                
                {evt.link && (
                  <a href={`https://${evt.link}`} target="_blank" rel="noreferrer" className="evt-link">
                    {evt.link} ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="cal-foot">
        Fuente: demre.cl | beneficiosestudiantiles.cl
      </div>
    </div>
  );
};

export default CalendarioAdmision;