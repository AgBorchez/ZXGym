import { useState } from 'react';

function FilaUsuario({ usuario, onEditar, onBorrar }) {
  // Estado local para alternar entre el botón de Editar y el de Borrar
  const [mostrarEditar, setMostrarEditar] = useState(true);

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

      {/* 2. Nombre y Apellido */}
      <td>{usuario.name}</td>
      <td>{usuario.lastName || usuario.lastname}</td>
      
      {/* 3. Email */}
      <td className="mail-col">{usuario.email}</td>

      {/* 4. Rol con Badge de color */}
      <td>
        <span className={`badge-rol ${getBadgeClass(usuario.type)}`}>
          {usuario.type}
        </span>
      </td>

      {/* 5. Columna de Acciones */}
      <td>
        <div className="acciones-container">
          {mostrarEditar ? (
            <button className="btn-editar-pro" onClick={() => onEditar(usuario)}>
              Editar
            </button>
          ) : (
            <button className="btn-borrar-pro" onClick={() => onBorrar(usuario.id)}>
              Eliminar
            </button>
          )}
          
          <button 
            className={`btn-switch ${!mostrarEditar ? 'activo-rojo' : ''}`} 
            onClick={() => setMostrarEditar(!mostrarEditar)}
            title="Cambiar entre Editar/Eliminar"
          >
            ⚙️
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaUsuario;