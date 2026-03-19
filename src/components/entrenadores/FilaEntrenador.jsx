import { useState } from 'react';

function FilaEntrenador({ entrenador, onEditar, onBorrar }) {
  // Estado local para alternar entre Editar y Borrar (Mantenemos tu lógica pro)
  const [mostrarEditar, setMostrarEditar] = useState(true);

  // Formateo de fechas
  const fechaIngreso = entrenador.joinDate ? entrenador.joinDate.split('T')[0] : '---';
  const fechaRCP = entrenador.rcpExpirationDate ? entrenador.rcpExpirationDate.split('T')[0] : '---';

  // Lógica de alerta para RCP vencido
  const hoy = new Date();
  const rcpVencido = entrenador.rcpExpirationDate && new Date(entrenador.rcpExpirationDate) < hoy;

  return (
    <tr className={!entrenador.isActive ? "fila-inactiva" : ""}>
      {/* Datos Personales */}
      <td>{entrenador.name}</td>
      <td>{entrenador.lastName || entrenador.lastname}</td>
      
      {/* Datos Específicos del Staff */}
      <td>
        <span className="badge-especialidad">
          {entrenador.specialty || 'General'}
        </span>
      </td>
      
      <td>
        <span className={`badge-turno ${entrenador.shift?.toLowerCase()}`}>
          {entrenador.shift}
        </span>
      </td>

      <td>{fechaIngreso}</td>

      {/* Fecha RCP con alerta visual si está vencido */}
      <td>
        <span style={{ 
          color: rcpVencido ? '#ff4d4d' : 'inherit', 
          fontWeight: rcpVencido ? 'bold' : 'normal' 
        }}>
          {fechaRCP} {rcpVencido && '⚠️'}
        </span>
      </td>

      <td className="mail-col">{entrenador.email}</td>

      {/* Columna de Acciones */}
      <td>
        <div className="acciones-container">
          {mostrarEditar ? (
            <button className="btn-editar-pro" onClick={() => onEditar(entrenador)}>
              Editar
            </button>
          ) : (
            <button className="btn-borrar-pro" onClick={() => onBorrar(entrenador.id)}>
              Baja
            </button>
          )}
          
          <button 
            className={`btn-switch ${!mostrarEditar ? 'activo-rojo' : ''}`} 
            onClick={() => setMostrarEditar(!mostrarEditar)}
            title="Cambiar acción"
          >
            ⚙️
          </button>
        </div>
      </td>
    </tr>
  );
}

export default FilaEntrenador;