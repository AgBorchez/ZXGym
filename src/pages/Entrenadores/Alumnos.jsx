import { useState } from 'react';
import TablaAlumnos from '../../components/entrenadores/TablaAlumnos';
import FormularioSocio from '../../components/socios/FormularioSocio.jsx';
import { useAuth } from '../../context/AuthContext.jsx'; 

function Alumnos() {
  const { user } = useAuth();
  const [actualizarTabla, setActualizarTabla] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [socioAEditar, setSocioAEditar] = useState(null);

  const refrescarLista = () => {
    setActualizarTabla(prev => prev + 1);
    setMostrarModal(false);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSocioAEditar(null);
  };

  const manejarVerFicha = (socio) => {
    setSocioAEditar(socio);
    setMostrarModal(true);
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        <div className="header-seccion">
          <div>
            <h1>Panel de Entrenamiento</h1>
            <p style={{ color: '#888', marginTop: '5px' }}>
              Bienvenido, {user?.nombre}. Aquí tienes la lista de tus alumnos asignados.
            </p>
          </div>
        </div>

        <hr className="divisor" />

        <TablaAlumnos key={actualizarTabla} onEditar={manejarVerFicha} />

        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Ficha del Alumno: {socioAEditar?.Name} {socioAEditar?.LastName}</h3>
                <button className="btn-cerrar-x" onClick={cerrarModal}>&times;</button>
              </div>
              
              <div className="form-body">
                <p style={{fontSize: '0.85rem', color: '#a0aec0', marginBottom: '15px'}}>
                  Información detallada y antecedentes médicos del socio.
                </p>
              
                <FormularioSocio 
                  alGuardar={refrescarLista} 
                  socioExistente={socioAEditar} 
                  esEntrenador={true} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Alumnos;