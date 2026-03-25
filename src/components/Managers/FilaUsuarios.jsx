import React from 'react';

function FilaUsuario({ usuario, onBorrar }) {
  const getBadgeClass = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'manager': return 'badge-manager';
      case 'entrenador': return 'badge-entrenador';
      case 'socio': return 'badge-socio';
      default: return 'badge-default';
    }
  };

  return (
    <tr className={usuario.status === 'inactive' ? "fila-inactiva" : ""}>
      <td style={{ fontWeight: '500' }}>{usuario.dni}</td>
      <td>{usuario.name}</td>
      <td>{usuario.lastName || usuario.lastname}</td>
      <td className="mail-col">{usuario.email}</td>
      <td>
        <span className={`badge-rol ${getBadgeClass(usuario.type)}`}>
          {usuario.type}
        </span>
      </td>
      <td>
        <div className="acciones-container" style={{ justifyContent: 'center' }}>
          <button
            className="btn-borrar-pro"
            onClick={() => onBorrar(usuario.id)}
            style={{ width: '100%' }}
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaUsuario;