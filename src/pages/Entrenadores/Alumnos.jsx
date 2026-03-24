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
          
          {/* El entrenador no crea socios, así que quitamos el botón verde de "Nuevo" 
              Podrías poner un botón de "Imprimir Reporte" o algo similar aquí si quisieras */}
        </div>

        <hr className="divisor" />

        {/* Pasamos el key para refrescar y el manejador de edición (que aquí actúa como Ver Ficha) */}
        <TablaAlumnos key={actualizarTabla} onEditar={manejarVerFicha} />

        {/* Modal de Detalle/Ficha del Alumno */}
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
              
                {/* Reutilizamos el FormularioSocio pero lo ideal sería que en este modo 
                    muchos campos sean ReadOnly para el entrenador */}
                <FormularioSocio 
                  alGuardar={refrescarLista} 
                  socioExistente={socioAEditar} 
                  esEntrenador={true} // Podrías pasar esta prop para deshabilitar planes/precios en el form
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