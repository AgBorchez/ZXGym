import { useState, useEffect, useCallback } from 'react';
import { API_ENTRENADORES_URL } from '../../Constants/config.js'; // Acordate de agregar esta URL
import FilaEntrenador from './FilaEntrenador'; 
import '../../styles/components/TablaSocios.css'; // Reutilizamos los estilos generales

function TablaEntrenadores({ onEditar }) {
  const [entrenadores, setEntrenadores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('activos'); // Por defecto vemos los que trabajan hoy
  const [cargando, setCargando] = useState(false);
  
  // SortConfig adaptado a los campos de Entrenador
  const [sortConfig, setSortConfig] = useState({ key: 'JoinDate', isAscending: false });

  const traerEntrenadores = useCallback(async () => {
    try {
      setCargando(true);
      const params = new URLSearchParams();
      
      params.append("SortBy", sortConfig.key);
      params.append("IsAscending", sortConfig.isAscending);
      
      // Filtro de actividad laboral
      if (filtroEstado !== 'todos') {
        params.append("ActiveOnly", filtroEstado === 'activos');
      }

      if (busqueda.trim() !== "") {
        params.append("buscar", busqueda);
      }

      const url = `${API_ENTRENADORES_URL}?${params.toString()}`;
      const respuesta = await fetch(url);
      const datos = await respuesta.json();
      setEntrenadores(datos);
    } catch (error) {
      console.error("Error al traer entrenadores:", error);
    } finally {
      setCargando(false);
    }
  }, [sortConfig, filtroEstado, busqueda]);

  useEffect(() => {
    const timer = setTimeout(() => {
      traerEntrenadores();
    }, 300);
    return () => clearTimeout(timer);
  }, [traerEntrenadores]);

  const manejarSort = (key) => {
    setSortConfig((prev) => ({
      key,
      isAscending: prev.key === key ? !prev.isAscending : true,
    }));
  };

  const manejarBorrar = async (id) => {
    if (window.confirm("¿Dar de baja a este entrenador?")) {
      try {
        const res = await fetch(`${API_ENTRENADORES_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setEntrenadores(entrenadores.filter((e) => e.id !== id));
        }
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  };

  // Configuración de columnas para Entrenadores
  const columnasConfig = [
    { label: "Nombre", key: "Name", width: "150px" },
    { label: "Apellido", key: "LastName", width: "150px" },
    { label: "Especialidad", key: "Specialty", width: "180px" },
    { label: "Turno", key: "Shift", width: "120px" },
    { label: "Ingreso", key: "JoinDate", width: "120px" },
    { label: "Vence RCP", key: "RCPExpirationDate", width: "140px" },
    { label: "Email", key: "Email", width: "250px" }
  ];

  return (
    <div className="tabla-container-pro">
      <div className="controles-superiores-pro">
        <h2 style={{ color: 'white', margin: 0 }}>Staff de Entrenadores</h2>
        
        <div className="grupo-filtros">
          {['activos', 'inactivos', 'todos'].map((estado) => (
            <button
              key={estado}
              className={`btn-filtro ${filtroEstado === estado ? 'activo' : ''}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado === 'activos' ? 'En Plantilla' : estado === 'inactivos' ? 'Bajas' : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      <div className="fila-busqueda">
        <div className="input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por especialidad, nombre o turno..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda-pro"
          />
        </div>
      </div>

      <div className="tabla-scroll-area">
        <table className="tabla-estilo">
          <thead>
            <tr>
              {columnasConfig.map((col) => (
                <th key={col.label} style={{ width: col.width, minWidth: col.width }}>
                  <div className="resizable-header">
                    <span className="header-label" onClick={() => manejarSort(col.key)}>
                      {col.label}
                      {sortConfig.key === col.key && (sortConfig.isAscending ? ' ↑' : ' ↓')}
                    </span>
                    <div className="resizer" /* Lógica de redimensionado igual a Socios */ />
                  </div>
                </th>
              ))}
              <th className="col-acciones" style={{ width: '160px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Cargando staff...</td></tr>
            ) : entrenadores.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No hay entrenadores registrados</td></tr>
            ) : (
              entrenadores.map((entrenador) => (
                <FilaEntrenador 
                  key={entrenador.id} 
                  entrenador={entrenador} 
                  onEditar={onEditar} 
                  onBorrar={manejarBorrar}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaEntrenadores;