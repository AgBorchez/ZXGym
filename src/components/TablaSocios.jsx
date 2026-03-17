import { useState, useEffect, useCallback } from 'react';
import { API_SOCIOS_URL } from '../Constants/config.js';
import FilaSocio from './FilaSocio';
import '../styles/TablaSocios.css';

function TablaSocios({ onEditar }) {
  const [socios, setSocios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [cargando, setCargando] = useState(false);
  const [vistaAfecciones, setVistaAfecciones] = useState(false);
  
  // Sincronizado con las keys de tu switch en C#
  const [sortConfig, setSortConfig] = useState({ key: 'DNI', isAscending: true });

  const traerSocios = useCallback(async () => {
    try {
      setCargando(true);

      // Construimos los parámetros exactos de tu controlador C#
      const params = new URLSearchParams();
      params.append("SortBy", sortConfig.key);
      params.append("IsAscending", sortConfig.isAscending);
      params.append("Tabla_Patologias", vistaAfecciones);
      
      // Manejo de ActiveOnly: tu backend discrimina por fecha actual
      if (filtroEstado !== 'todos') {
        params.append("ActiveOnly", filtroEstado === 'activos');
      }

      // Parámetro de búsqueda para el backend
      if (busqueda.trim() !== "") {
        params.append("buscar", busqueda);
      }

      const url = `${API_SOCIOS_URL}?${params.toString()}`;
      const respuesta = await fetch(url);
      const datos = await respuesta.json();
      setSocios(datos);
    } catch (error) {
      console.error("Error al traer socios:", error);
    } finally {
      setCargando(false);
    }
    // Agregamos busqueda a las dependencias para que el servidor filtre mientras escribes
  }, [sortConfig, filtroEstado, vistaAfecciones, busqueda]);

  useEffect(() => {
    // Implementamos un pequeño debounce para no saturar el servidor al escribir
    const timer = setTimeout(() => {
      traerSocios();
    }, 300);

    return () => clearTimeout(timer);
  }, [traerSocios]);

  const manejarSort = (key) => {
    setSortConfig((prev) => ({
      key,
      isAscending: prev.key === key ? !prev.isAscending : true,
    }));
  };

  const manejarBorrar = async (dni) => {
    if (window.confirm("¿Estás seguro de que querés borrar este socio?")) {
      try {
        const res = await fetch(`${API_SOCIOS_URL}/${dni}`, { method: 'DELETE' });
        if (res.ok) {
          setSocios(socios.filter((s) => s.dni !== dni));
          alert("Socio borrado con éxito");
        }
      } catch (error) {
        console.error("Error al borrar:", error);
      }
    }
  };

  const iniciarRedimensionado = (e) => {
    e.preventDefault();
    const th = e.target.closest('th');
    const inicioX = e.pageX;
    const anchoInicio = th.offsetWidth;
    const alMover = (ev) => {
      const nuevoAncho = anchoInicio + (ev.pageX - inicioX);
      if (nuevoAncho > 60) {
        th.style.width = `${nuevoAncho}px`;
        th.style.minWidth = `${nuevoAncho}px`;
      }
    };
    const alSoltar = () => {
      document.removeEventListener('mousemove', alMover);
      document.removeEventListener('mouseup', alSoltar);
    };
    document.addEventListener('mousemove', alMover);
    document.addEventListener('mouseup', alSoltar);
  };

  // Keys mapeadas exactamente al switch(SortBy.ToLower()) de tu C#
  const columnasConfig = vistaAfecciones 
    ? [
        { label: "DNI", key: "DNI", width: "106px" },
        { label: "Nombre", key: "name", width: "115px" },
        { label: "Apellido", key: "lastname", width: "107px" },
        { label: "Patologías", key: "DNI", width: "450px" },
      ]
    : [
        { label: "DNI", key: "DNI", width: "106px" },
        { label: "Nombre", key: "name", width: "115px" },
        { label: "Apellido", key: "lastname", width: "107px" },
        { label: "Teléfono", key: "DNI", width: "178px" }, 
        { label: "Mail", key: "email", width: "300px" },
        { label: "Ingreso", key: "JoinDate", width: "120px" },
        { label: "Vence", key: "EndDate", width: "120px" },
        { label: "Plan", key: "DNI", width: "100px" }
      ];

  return (
    <div className="tabla-container-pro">
      <div className="controles-superiores-pro">
        <div className="view-switcher">
          <button className={`btn-view ${!vistaAfecciones ? 'active' : ''}`} onClick={() => setVistaAfecciones(false)}>General</button>
          <div className="toggle-track" onClick={() => setVistaAfecciones(!vistaAfecciones)}>
            <div className={`toggle-dot ${vistaAfecciones ? 'right' : ''}`}></div>
          </div>
          <button className={`btn-view ${vistaAfecciones ? 'active' : ''}`} onClick={() => setVistaAfecciones(true)}>Salud</button>
        </div>

        <div className="grupo-filtros">
          {['todos', 'activos', 'inactivos'].map((estado) => (
            <button
              key={estado}
              className={`btn-filtro ${filtroEstado === estado ? 'activo' : ''}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="fila-busqueda">
        <div className="input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o mail..."
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
                    <div className="resizer" onMouseDown={iniciarRedimensionado} />
                  </div>
                </th>
              ))}
              <th className="col-acciones" style={{ width: '160px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan="10" style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Actualizando...</td></tr>
            ) : socios.length === 0 ? (
              <tr><td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>No se encontraron socios</td></tr>
            ) : (
              socios.map((socio) => (
                <FilaSocio 
                  key={socio.dni} 
                  socio={socio} 
                  onEditar={onEditar} 
                  onBorrar={manejarBorrar}
                  vistaAfecciones={vistaAfecciones}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TablaSocios;