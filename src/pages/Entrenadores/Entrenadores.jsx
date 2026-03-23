import { useState } from 'react';
import TablaEntrenadores from '../../components/entrenadores/TablaEntrenadores.jsx';
import FormularioEntrenador from '../../components/entrenadores/FormularioEntrenador.jsx';

function Entrenadores() {
  const [actualizarTabla, setActualizarTabla] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [entrenadorAEditar, setEntrenadorAEditar] = useState(null);

  // Función para refrescar la lista después de un POST o PUT
  const refrescarLista = () => {
    setActualizarTabla(prev => prev + 1);
    setMostrarModal(false); 
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setEntrenadorAEditar(null); 
  };

  const manejarEditar = (entrenador) => {
    setEntrenadorAEditar(entrenador); 
    setMostrarModal(true);  
  };

  return (
    <div className="app-wrapper"> 
      <div className="container">
        <div className="header-seccion">
          <h1>Gestión de Staff</h1>
          
          <button 
            className="btn-nuevo-socio-verde" // Mantenemos la clase del botón verde que te gustó
            onClick={() => { setEntrenadorAEditar(null); setMostrarModal(true); }}
          >
            + Nuevo Entrenador
          </button>
        </div>

        <hr className="divisor" />

        {/* Pasamos la key para forzar el remonte de la tabla al actualizar */}
        <TablaEntrenadores key={actualizarTabla} onEditar={manejarEditar} />

        {/* Modal de Entrenadores */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{entrenadorAEditar ? 'Editando Staff' : 'Registrar Entrenador'}</h3>
                <button className="btn-cerrar-x" onClick={cerrarModal}>&times;</button>
              </div>
              <div className="form-body">
                <p style={{fontSize: '0.8rem', color: '#a0aec0', marginBottom: '10px'}}>
                   Datos profesionales del entrenador:
                </p>
              
                <FormularioEntrenador 
                  alGuardar={refrescarLista} 
                  entrenadorExistente={entrenadorAEditar} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Entrenadores;