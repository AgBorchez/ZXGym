import { useState } from 'react';
import TablaSocios from './components/TablaSocios';
import FormularioSocio from './components/FormularioSocio';
import Navbar from './components/Navbar.jsx'

function App() {
  const [actualizarTabla, setActualizarTabla] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [socioAEditar, setSocioAEditar] = useState(null);

  const refrescarLista = () => {
    setActualizarTabla(prev => prev + 1);
    setMostrarModal(false); // 2. Cerramos el modal automáticamente al guardar
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSocioAEditar(null); // Limpiamos el socio al cerrar
  };

  const manejarEditar = (socio) => {
    setSocioAEditar(socio); // Guardamos los datos del socio elegido
    setMostrarModal(true);  // Abrimos el mismo modal de siempre
  };

  return (
    <div className="app-wrapper"> {/* Este envuelve TODO y da el fondo oscuro */}
      
      <Navbar /> {/* Al estar fuera de 'container', ocupa el 100% del ancho */}

      <div className="container">
        <div className="header-seccion">
          <h1>Gestión de Socios</h1>
          
          {/* Botón para abrir el modal */}
          <button 
            className="btn-principal"
            onClick={() => { setSocioAEditar(null); setMostrarModal(true); }}
          >
            + Nuevo Socio
          </button>
        </div>

        <hr className="divisor" />

        {/* La tabla con sus filtros internos */}
        <TablaSocios key={actualizarTabla} onEditar={manejarEditar} />

        {/* Lógica del Modal */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{socioAEditar ? 'Editando Socio' : 'Creando Socio'}</h3>
                <button className="btn-cerrar-x" onClick={cerrarModal}>&times;</button>
              </div>
              <div className="form-body">
                <p style={{fontSize: '0.8rem', color: '#a0aec0', marginBottom: '10px'}}>Completa los siguientes campos:</p>
              
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

export default App;