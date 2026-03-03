import React, { useState, useEffect } from 'react';

const CarrerasTable = ({ selectedCarreras = [], onToggleComparar }) => {
  const [carreras, setCarreras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const PAGE_SIZE = 20;

  // Extraemos solo los IDs para una búsqueda rápida en el render
  const selectedIds = selectedCarreras.map(c => c.id_carrera);

  const fetchCarreras = async (currentPage, query) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, page_size: PAGE_SIZE });
      if (query) params.append('nombre_carrera', query);

      const response = await fetch(`https://caminoalau-api.onrender.com/carreras?${params.toString()}`);
      const data = await response.json();
      
      setCarreras(data.data || []);
      setTotalPages(data.total_pages || 1);
      setTotalRegistros(data.total_registros || 0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarreras(page, searchTerm);
  }, [page, searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Función local para manejar el aviso de límite antes de llamar a la prop
  const handleToggle = (carrera) => {
    const isSelected = selectedIds.includes(carrera.id_carrera);
    if (!isSelected && selectedCarreras.length >= 3) {
      alert("⚠️ Solo puedes comparar hasta 3 carreras simultáneamente.");
      return;
    }
    onToggleComparar(carrera);
  };

  const renderBadge = (nivel) => {
    if (!nivel) return <span className="badge b-sd">S/D</span>;
    const map = { 'Excelencia': 'b-exc', 'Avanzado': 'b-ava', 'Básico': 'b-bas', 'No Acreditada': 'b-nac' };
    return <span className={`badge ${map[nivel] || 'b-sd'}`}>{nivel}</span>;
  };

  const trunc = (str, n) => (str && str.length > n ? str.slice(0, n) + '…' : str);

  return (
    <>
      <div className="search-box animate-in">
        <label className="search-label">Buscador de Carreras</label>
        <div className="search-row">
          <input 
            type="text" 
            className="field" 
            placeholder="Escribe el nombre de una carrera o universidad..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ padding: '0.8rem', width: '100%' }}
          />
        </div>
      </div>

      <div className="table-section animate-in" style={{ animationDelay: '0.1s' }}>
        <div className="table-topbar">
          <span className="result-count">
            {loading ? 'Cargando...' : `${totalRegistros.toLocaleString('es-CL')} carreras encontradas`}
          </span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th style={{ width: '100px', textAlign: 'center' }}>Comparar</th>
                <th>Carrera</th>
                <th>Institución</th>
                <th>Sede</th>
                <th>Acreditación</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // SKELETON CON 5 COLUMNAS
                [...Array(6)].map((_, i) => (
                  <tr key={i} style={{ opacity: 0.4 }}>
                    <td style={{ textAlign: 'center' }}><div style={{ height: '24px', width: '24px', background: '#e2e8f0', borderRadius: '4px', margin: 'auto' }}></div></td>
                    <td><div style={{ height: '12px', background: '#e2e8f0', borderRadius: '4px', width: '80%' }}></div></td>
                    <td><div style={{ height: '12px', background: '#e2e8f0', borderRadius: '4px', width: '60%' }}></div></td>
                    <td><div style={{ height: '12px', background: '#e2e8f0', borderRadius: '4px', width: '40%' }}></div></td>
                    <td><div style={{ height: '20px', background: '#e2e8f0', borderRadius: '12px', width: '50%' }}></div></td>
                  </tr>
                ))
              ) : (
                carreras.map((c) => {
                  const isSelected = selectedIds.includes(c.id_carrera);
                  return (
                    <tr key={c.id_carrera} className={isSelected ? 'row-selected' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          onClick={() => handleToggle(c)}
                          className={`btn ${isSelected ? 'btn-selected' : 'btn-add'}`}
                          title={isSelected ? "Quitar de la comparación" : "Agregar a la comparación"}
                        >
                          {isSelected ? '✓' : '+'}
                        </button>
                      </td>
                      <td><div className="cn">{trunc(c.nombre_carrera, 35)}</div></td>
                      <td><div className="ci">{trunc(c.institucion, 25)}</div></td>
                      <td>{trunc(c.sede, 20)}</td>
                      <td>{renderBadge(c.nivel_cna)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button className="btn-pg" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>←</button>
          <span className="pg-info">Pág. {page} de {totalPages}</span>
          <button className="btn-pg" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>→</button>
        </div>
      </div>

      <style>{`
        .btn-add {
          background-color: white;
          border: 1.5px solid var(--accent-blue);
          color: var(--accent-blue);
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
        }
        .btn-add:hover {
          background-color: var(--accent-blue);
          color: white;
        }
        .btn-selected {
          background-color: var(--accent-blue);
          color: white;
          border: 1.5px solid var(--accent-blue);
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          cursor: pointer;
        }
        .row-selected {
          background-color: #f0f7ff !important;
        }
        .cn { font-weight: 700; color: var(--primary-navy); }
        .ci { color: var(--text-muted); font-size: 0.85rem; }
      `}</style>
    </>
  );
};

export default CarrerasTable;