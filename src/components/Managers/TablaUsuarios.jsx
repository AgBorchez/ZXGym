import { useState, useEffect, useCallback } from 'react';
import { API_USUARIOS_URL } from '../../Constants/config.js';
import FilaUsuario from './FilaUsuarios';
import '../../styles/components/TablaSocios.css';

function TablaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [cargando, setCargando] = useState(false);

  const [sortConfig, setSortConfig] = useState({ key: 'Name', isAscending: true });

  const traerUsuarios = useCallback(async () => {
    try {
      setCargando(true);
      const params = new URLSearchParams();

      params.append("SortBy", sortConfig.key);
      params.append("IsAscending", sortConfig.isAscending);

      if (filtroRol !== 'todos') {
        params.append("Type", filtroRol);
      }

      if (busqueda.trim() !== "") {
        params.append("buscar", busqueda);
      }

      const url = `${API_USUARIOS_URL}?${params.toString()}`;
      const respuesta = await fetch(url);
      const datos = await respuesta.json();
      setUsuarios(datos);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    } finally {
      setCargando(false);
    }
  }, [sortConfig, filtroRol, busqueda]);

  useEffect(() => {
    const timer = setTimeout(() => {
      traerUsuarios();
    }, 300);
    return () => clearTimeout(timer);
  }, [traerUsuarios]);

  const manejarSort = (key) => {
    setSortConfig((prev) => ({
      key,
      isAscending: prev.key === key ? !prev.isAscending : true,
    }));
  };

  const manejarBorrar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este usuario? Perderá todo acceso al sistema.")) {
      try {
        const res = await fetch(`${API_USUARIOS_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setUsuarios(usuarios.filter((u) => u.id !== id));
        }
      } catch (error) {
        console.error("Error al borrar usuario:", error);
      }
    }
  };

  const columnasConfig = [
    { label: "DNI", key: "DNI", width: "120px" },
    { label: "Nombre", key: "Name", width: "180px" },
    { label: "Apellido", key: "LastName", width: "180px" },
    { label: "Email", key: "Email", width: "280px" },
    { label: "Rol / Tipo", key: "Type", width: "150px" }
  ];

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

  return (
    <div className="tabla-container-pro">
      <div className="controles-superiores-pro">
        <h2 style={{ color: 'white', margin: 0 }}>Gestión Global de Usuarios</h2>

        <div className="grupo-filtros">
          {['todos', 'Socio', 'Entrenador', 'Manager'].map((rol) => (
            <button
              key={rol}
              className={`btn-filtro ${filtroRol === rol ? 'activo' : ''}`}
              onClick={() => setFiltroRol(rol)}
            >
              {rol === 'todos' ? 'Todos' : rol + 's'}
            </button>
          ))}
        </div>
      </div>

      <div className="fila-busqueda">
        <div className="input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar por DNI, Nombre o Email..."
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
              <th className="col-acciones" style={{ width: '120px' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Cargando...</td></tr>
            ) : usuarios.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No se encontraron usuarios</td></tr>
            ) : (
              usuarios.map((usuario) => (
                <FilaUsuario
                  key={usuario.id}
                  usuario={usuario}
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

export default TablaUsuarios;