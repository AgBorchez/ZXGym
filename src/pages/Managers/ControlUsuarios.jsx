import React, { useState } from 'react';
import TablaUsuarios from '../../components/Managers/TablaUsuarios';
import ModalInvitacion from '../../components/Managers/ModalInvitacion';
import '../../styles/pages/Usuarios.css';

const ControlUsuarios = () => {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModalEdit, setMostrarModalEdit] = useState(false);
  const [mostrarModalInvite, setMostrarModalInvite] = useState(false);

  const manejarEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEdit(true);
  };

  return (
    <div className="page-usuarios-container">
      <header className="page-header">
        <div className="header-info">
          <h1>Panel de Control de Usuarios</h1>
          <p>Administrá los accesos de Managers, Entrenadores y Socios desde un solo lugar.</p>
        </div>
        
        <div className="header-actions">
          <button className="btn-primario-pro" onClick={() => setMostrarModalInvite(true)}>
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
        </section>

        <TablaUsuarios onEditar={manejarEditar} />
      </main>

      <ModalInvitacion
        isOpen={mostrarModalInvite} 
        onClose={() => setMostrarModalInvite(false)} 
      />

      {mostrarModalEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Editar Usuario: {usuarioSeleccionado?.name}</h3>
            <button className="btn-secondary" onClick={() => setMostrarModalEdit(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ControlUsuarios;