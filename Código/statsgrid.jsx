import React, { useState, useEffect } from 'react';

const StatsGrid = () => {
  const [stats, setStats] = useState({
    total_carreras: 0,
    total_alertas_roi: 0,
    excelencia: 0,
    sin_acreditacion: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('https://caminoalau-api.onrender.com/stats');
        const data = await response.json();

        // Mapeo consistente con openapi.json y tu archivo HTML
        setStats({
          total_carreras: data.total_carreras || 0,
          total_alertas_roi: data.total_alertas_roi || 0,
          // Accedemos al objeto distribucion_nivel_cna según tu código actual
          excelencia: data.distribucion_nivel_cna?.['Excelencia'] || 0,
          sin_acreditacion: data.distribucion_nivel_cna?.['No Acreditada'] || 0
        });
      } catch (error) {
        console.error("Error cargando estadísticas de Camino a la U:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="stats-grid"><p>Actualizando indicadores...</p></div>;

  return (
    <div className="stats-grid">
      {/* 1. Total Carreras */}
      <div className="stat-card">
        <div className="stat-lbl">Total Carreras</div>
        <div className="stat-val">
          {stats.total_carreras.toLocaleString('es-CL')}
        </div>
      </div>

      {/* 2. Con brecha financiera (Alertas ROI) */}
      <div className="stat-card">
        <div className="stat-lbl">Con brecha financiera</div>
        <div className="stat-val warn">
          {stats.total_alertas_roi.toLocaleString('es-CL')}
        </div>
      </div>

      {/* 3. Acreditación Excelencia */}
      <div className="stat-card">
        <div className="stat-lbl">Acreditación excelencia</div>
        <div className="stat-val grn">
          {stats.excelencia.toLocaleString('es-CL')}
        </div>
      </div>

      {/* 4. Sin acreditación vigente */}
      <div className="stat-card">
        <div className="stat-lbl">Sin acreditación vigente</div>
        <div className="stat-val red">
          {stats.sin_acreditacion.toLocaleString('es-CL')}
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;