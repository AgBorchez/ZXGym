import { useState } from 'react';
import TablaSocios from '../../components/socios/TablaSocios.jsx';
import FormularioSocio from '../../components/socios/FormularioSocio.jsx';

function Socios() {
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

  const manejarEditar = (socio) => {
    setSocioAEditar(socio);
    setMostrarModal(true);
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        <div className="header-seccion">
          <h1>Gestión de Socios</h1>
          
          <button 
            className="btn-nuevo-socio-verde"
            onClick={() => { setSocioAEditar(null); setMostrarModal(true); }}
          >
            + Nuevo Socio
          </button>
        </div>

        <hr className="divisor" />

        <TablaSocios key={actualizarTabla} onEditar={manejarEditar} />

        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{socioAEditar ? 'Editando Socio' : 'Creando Socio'}</h3>
                <button className="btn-cerrar-x" onClick={cerrarModal}>&times;</button>
              </div>
              <div className="form-body">
                <p style={{fontSize: '0.8rem', color: '#a0aec0', marginBottom: '10px'}}>
                  Completa los siguientes campos:
                </p>
              
                <FormularioSocio 
                  alGuardar={refrescarLista} 
                  socioExistente={socioAEditar} 
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Socios;