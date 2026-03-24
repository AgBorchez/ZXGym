import React from 'react';
import InviteManager from './InviteManager';
import InviteEntrenador from './InviteEntrenador';
import '../../styles/components/ModalsInvitaciones.css';

const ModalInvitacion = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content invitation-modal">
        <div className="modal-header">
          <h3>Generar Invitaciones de Staff</h3>
          <button className="close-x" onClick={onClose}>&times;</button>
        </div>
        
        <div className="invitation-options">
          {/* Componentes de generación de tokens */}
          <InviteManager />
          <InviteEntrenador />
        </div>
      </div>
    </div>
  );
};

export default ModalInvitacion;