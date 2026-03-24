import { useState, useEffect, useCallback } from 'react';
import { API_SOCIOS_URL } from '../../Constants/config.js'; 
import { useAuth } from '../../context/AuthContext.jsx'; // Para obtener el ID del entrenador
import FilaSocio from '../socios/FilaSocio.jsx';
import '../../styles/components/TablaSocios.css';

function TablaAlumnos({ onEditar }) {
  const { user } = useAuth(); // Obtenemos los datos del entrenador logueado
  const [socios, setSocios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  
  // Ordenamiento por defecto: Fecha de ingreso más reciente
  const [sortConfig, setSortConfig] = useState({ key: 'JoinDate', isAscending: false });

  const traerMisSocios = useCallback(async () => {
    if (!user?.id) return; // Seguridad: Si no hay ID de entrenador, no disparamos

    try {
      setCargando(true);
      
      // Armamos la URL apuntando al nuevo endpoint filtrado por ID de entrenador
      // Ejemplo: /api/socios/mis-socios/5
      let url = `${API_SOCIOS_URL}/mis-socios/${user.id}`;
      
      // Agregamos parámetros de orden y búsqueda si tu backend los soporta en este endpoint
      const params = new URLSearchParams();
      params.append("SortBy", sortConfig.key);
      params.append("IsAscending", sortConfig.isAscending);
      if (busqueda.trim() !== "") params.append("buscar", busqueda);
      
      const respuesta = await fetch(`${url}?${params.toString()}`);
      const datos = await respuesta.json();
      setSocios(datos);
    } catch (error) {
      console.error("Error al traer mis socios:", error);
    } finally {
      setCargando(false);
    }
  }, [user?.id, sortConfig, busqueda]);

  useEffect(() => {
    const timer = setTimeout(() => {
      traerMisSocios();
    }, 300);
    return () => clearTimeout(timer);
  }, [traerMisSocios]);

  const manejarSort = (key) => {
    setSortConfig((prev) => ({
      key,
      isAscending: prev.key === key ? !prev.isAscending : true,
    }));
  };

  // Configuración de columnas orientada a SOCIOS (lo que el entrenador necesita ver)
  const columnasConfig = [
    { label: "DNI", key: "DNI", width: "110px" },
    { label: "Nombre", key: "Name", width: "150px" },
    { label: "Apellido", key: "LastName", width: "150px" },
    { label: "Teléfono", key: "Phone", width: "130px" },
    { label: "Fecha Ingreso", key: "JoinDate", width: "140px" },
    { label: "Vencimiento", key: "EndDate", width: "140px" },
    { label: "Email", key: "Email", width: "220px" }
  ];

  return (
    
    <div className="tabla-container-pro">
      <div className="controles-superiores-pro">
        <h2 style={{ color: 'white', margin: 0 }}>Mis Alumnos Asignados</h2>
      </div>

      <div className="fila-busqueda">
        <div className="input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar alumno por nombre, apellido o DNI..."
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
                    <div className="resizer" />
                  </div>
                </th>
              ))}
              <th className="col-acciones" style={{ width: '100px' }}>Ficha</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Cargando tus alumnos...</td></tr>
            ) : socios.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>No tienes alumnos asignados todavía</td></tr>
            ) : (
              socios.map((socio) => (
                <FilaSocio 
                  key={socio.id} 
                  socio={socio} 
                  onEditar={onEditar} 
                  // El entrenador normalmente no borra socios, solo ve su ficha
                  soloLectura={true} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaAlumnos;