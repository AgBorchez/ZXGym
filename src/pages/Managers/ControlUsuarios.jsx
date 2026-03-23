import React, { useState } from 'react';
import TablaUsuarios from '../../components/Managers/TablaUsuarios'; // Ajustá la ruta según tu carpeta
import '../../styles/pages/Usuarios.css'; // Estilos específicos para el layout de la página

const ControlUsuarios = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Función que se dispara al tocar "Editar" en una fila
  const manejarEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModal(true);
    console.log("Editando a:", usuario.name);
    // Aquí podrías abrir un modal con un formulario pre-cargado
  };

  return (
    <div className="page-usuarios-container">
      <header className="page-header">
        <div className="header-info">
          <h1>Panel de Control de Usuarios</h1>
          <p>Administrá los accesos de Managers, Entrenadores y Socios desde un solo lugar.</p>
        </div>
        
        <div className="header-actions">
          {/* Este botón podría llevar a la lógica de "Generar Invitación" que hablamos antes */}
          <button className="btn-primario-pro" onClick={() => window.location.href='/invitar'}>
            + Invitar Staff
          </button>
        </div>
      </header>

      <main className="content-area">
        <section className="stats-rapidas">
          <div className="stat-card">
            <span className="stat-label">Total Usuarios</span>
            <span className="stat-value">---</span>
          </div>
          {/* Podés agregar más tarjetitas de resumen aquí */}
        </section>

        {/* Renderizamos el componente de la Tabla que ya tenemos listo */}
        <TablaUsuarios onEditar={manejarEditar} />
      </main>

      {/* Aquí iría tu componente Modal si mostrarModal es true */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Usuario: {usuarioSeleccionado?.name}</h3>
            {/* Formulario de edición... */}
            <button onClick={() => setMostrarModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlUsuarios;