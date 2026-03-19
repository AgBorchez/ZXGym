import { useState } from 'react';

function FilaSocio({ socio, onEditar, onBorrar, vistaAfecciones }) {
  // Estado local para alternar entre Editar y Borrar
  const [mostrarEditar, setMostrarEditar] = useState(true);

  // Formateo de fechas (asumiendo formato ISO del backend)
  const fechaIngreso = socio.joinDate ? socio.joinDate.split('T')[0] : '---';
  const fechaVencimiento = socio.endDate ? socio.endDate.split('T')[0] : '---';

  return (
    <tr>
      {/* Columnas fijas: DNI, Nombre y Apellido aparecen en ambas vistas */}
      <td>{socio.DNI || socio.dni}</td>
      <td>{socio.name}</td>
      <td>{socio.lastName || socio.lastname}</td>

      {vistaAfecciones ? (
        /* --- VISTA DE PATOLOGÍAS --- */
        <td>
          <div className="afecciones-wrapper">
            {socio.patologias && socio.patologias.length > 0 ? (
              socio.patologias.map((id) => (
                <span key={id} className="afeccion-badge">
                  {id}
                </span>
              ))
            ) : (
              <span style={{ color: '#718096', fontStyle: 'italic' }}>Sin patologías</span>
            )}
          </div>
        </td>
      ) : (
        /* --- VISTA GENERAL --- */
        <>
          <td>{socio.phone}</td>
          <td className="mail-col">{socio.email}</td>
          <td>{fechaIngreso}</td>
          <td>{fechaVencimiento}</td>
          <td>
            <span className="badge-plan">
              {socio.planId ? `Plan ${socio.planId}` : 'Sin Plan'}
            </span>
          </td>
        </>
      )}

      {/* Columna de Acciones: Siempre visible */}
      <td>
        <div className="acciones-container">
          {mostrarEditar ? (
            <button className="btn-editar-pro" onClick={() => onEditar(socio)}>
              Editar
            </button>
          ) : (
            <button className="btn-borrar-pro" onClick={() => onBorrar(socio.id || socio.ID)}>
              Borrar
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

export default FilaSocio;