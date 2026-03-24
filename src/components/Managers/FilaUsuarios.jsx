import React from 'react';

function FilaUsuario({ usuario, onBorrar }) {
  // Función para asignar color al badge según el rol
  const getBadgeClass = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case 'manager': return 'badge-manager'; // Rojo/Naranja
      case 'entrenador': return 'badge-entrenador'; // Azul
      case 'socio': return 'badge-socio'; // Verde
      default: return 'badge-default';
    }
  };

  return (
    <tr className={usuario.status === 'inactive' ? "fila-inactiva" : ""}>
      {/* 1. DNI */}
      <td style={{ fontWeight: '500' }}>{usuario.dni}</td>

      {/* 2. Nombre */}
      <td>{usuario.name}</td>

      {/* 3. Apellido */}
      <td>{usuario.lastName || usuario.lastname}</td>
      
      {/* 4. Email */}
      <td className="mail-col">{usuario.email}</td>

      {/* 5. Rol con Badge de color */}
      <td>
        <span className={`badge-rol ${getBadgeClass(usuario.type)}`}>
          {usuario.type}
        </span>
      </td>

      {/* 6. Columna de Acciones (Solo Borrado) */}
      <td>
        <div className="acciones-container" style={{ justifyContent: 'center' }}>
          <button 
            className="btn-borrar-pro" 
            onClick={() => onBorrar(usuario.id)}
            style={{ width: '100%' }} // Para que ocupe el ancho del contenedor de acciones
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaUsuario;