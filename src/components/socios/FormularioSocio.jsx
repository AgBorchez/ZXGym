import { useEffect, useState } from 'react';
import { API_SOCIOS_URL } from '../../Constants/config.js';
import '../../styles/components/FormularioSocio/FormularioSocio.css';

const estadoInicial = {
  id: '', DNI: '', Name: '', LastName: '', Email: '',
  Phone: '', JoinDate: '', EndDate: '', PlanId: ''
};

const PlanesPrueba = [
  { id: 1, nombre: "Mensual", dias: 30 },
  { id: 2, nombre: "Trimestral", dias: 90 },
  { id: 3, nombre: "Semestral", dias: 180 },
  { id: 4, nombre: "Anual", dias: 365 }
];

const PATOLOGIAS_DB = [
  { id: 1, nombre: "Hipertensión Arterial" },
  { id: 2, nombre: "Problemas Cardíacos" },
  { id: 3, nombre: "Lesiones de Columna" },
  { id: 4, nombre: "Lesiones Articulares" },
  { id: 5, nombre: "Asma / Problemas Respiratorios" },
  { id: 6, nombre: "Diabetes" },
  { id: 7, nombre: "Cirugías Recientes" },
  { id: 8, nombre: "Mareos / Vértigo" },
  { id: 9, nombre: "Embarazo" },
  { id: 10, nombre: "Medicación Crónica" }
];

function FormularioSocio({ alGuardar, socioExistente }) {
  const [formData, setFormData] = useState(estadoInicial);
  const [fase, setFase] = useState(1);
  const [patologiasSeleccionadas, setPatologiasSeleccionadas] = useState([]);
  const [errores, setErrores] = useState({});

  const validarFase1 = () => {
    let nuevosErrores = {};
    if (!formData.DNI) nuevosErrores.DNI = "El DNI es obligatorio";
    if (!formData.Name) nuevosErrores.Name = "El nombre es obligatorio";
    if (!formData.LastName) nuevosErrores.LastName = "El apellido es obligatorio";
    if (!formData.Email) nuevosErrores.Email = "El email es obligatorio";
    if (!formData.JoinDate) nuevosErrores.JoinDate = "La fecha de ingreso es obligatoria";
    if (!formData.PlanId) nuevosErrores.PlanId = "Debes seleccionar un plan";

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    let nuevoEstado = { ...formData, [name]: value };

    if (name === "PlanId" || name === "JoinDate") {
      const planIdABuscar = name === "PlanId" ? parseInt(value) : parseInt(nuevoEstado.PlanId);
      const planElegido = PlanesPrueba.find(p => p.id === planIdABuscar);
      if (planElegido && nuevoEstado.JoinDate) {
        const fechaInicio = new Date(nuevoEstado.JoinDate);
        fechaInicio.setDate(fechaInicio.getDate() + planElegido.dias);
        nuevoEstado.EndDate = fechaInicio.toISOString().split('T')[0];
      }
    }
    setFormData(nuevoEstado);
  };

  useEffect(() => {
    if (socioExistente && socioExistente.id !== formData.id) {
      setFormData({
        id: socioExistente.id || '',
        DNI: socioExistente.dni || '',
        Name: socioExistente.name || '',
        LastName: socioExistente.lastName || '',
        Email: socioExistente.email || '',
        Phone: socioExistente.phone || '',
        PlanId: socioExistente.planId || '',
        JoinDate: socioExistente.joinDate ? socioExistente.joinDate.split('T')[0] : '',
        EndDate: socioExistente.endDate ? socioExistente.endDate.split('T')[0] : ''
      });
      if (socioExistente.patologias) setPatologiasSeleccionadas(socioExistente.patologias);
    }
    if (!socioExistente && formData.id !== '') setFormData(estadoInicial);
  }, [socioExistente]);

  const enviarFormulario = async (e) => {
    e.preventDefault();
    const Edicion = !!socioExistente;
    
    const urlFinal = Edicion 
      ? `${API_SOCIOS_URL}/${formData.id}` 
      : `${API_SOCIOS_URL}/register-socio`; 

    const metodo = Edicion ? 'PUT' : 'POST';

    const datosParaCsharp = {
      DNI: parseInt(formData.DNI),
      Name: formData.Name,
      LastName: formData.LastName,
      Email: formData.Email,
      Phone: formData.Phone,
      PlanId: parseInt(formData.PlanId),
      Password: "", 
      Patologias: patologiasSeleccionadas
    };

    try {
      const res = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaCsharp)
      });

      if (res.ok) {
        alert(Edicion ? "¡Socio actualizado!" : "¡Socio y Usuario creados! El socio podrá configurar su clave al ingresar.");
        setFormData(estadoInicial);
        setPatologiasSeleccionadas([]);
        setFase(1);
        alGuardar();
      } else {
        const errorData = await res.json();
        alert("Error: " + (errorData.message || "No se pudo procesar el registro"));
      }
    } catch (error) {
      console.error("Error en la red:", error);
    }
  };

  return (
    <form onSubmit={enviarFormulario}>
      {fase === 1 && (
        <div className="form-animate-fade">
          {errores.DNI && <span className="error-text">{errores.DNI}</span>}
          <div className="form-row">
            <label>DNI</label>
            <input 
              name="DNI" 
              type="number"
              placeholder='Ej: 47892421' 
              value={formData.DNI} 
              onChange={(e) => {
                manejarCambio(e); 
                if (errores.DNI) setErrores({ ...errores, DNI: null });
              }} 
              required 
              readOnly={!!socioExistente}
              className={socioExistente ? "input-readonly" : (errores.DNI ? "input-error" : "")}
            />
          </div>

          {errores.Name && <span className="error-text">{errores.Name}</span>}
          <div className="form-row">
            <label>Nombre</label>
            <input 
              name="Name" 
              placeholder='Juan' 
              value={formData.Name} 
              onChange={(e) => {
                manejarCambio(e);
                if (errores.Name) setErrores({ ...errores, Name: null });
              }} 
              className={errores.Name ? "input-error" : ""}
              required 
            />
          </div>

          {errores.LastName && <span className="error-text">{errores.LastName}</span>}
          <div className="form-row">
            <label>Apellido</label>
            <input 
              name="LastName" 
              placeholder="Perez"
              value={formData.LastName} 
              onChange={(e) => {
                manejarCambio(e);
                if (errores.LastName) setErrores({ ...errores, LastName: null });
              }} 
              className={errores.LastName ? "input-error" : ""}
              required 
            />
          </div>

          {errores.Email && <span className="error-text">{errores.Email}</span>}
          <div className="form-row">
            <label>Email</label>
            <input 
              name="Email" 
              type="email"
              placeholder='Ej: nombre@correo.com' 
              value={formData.Email} 
              onChange={(e) => {
                manejarCambio(e);
                if (errores.Email) setErrores({ ...errores, Email: null });
              }} 
              className={errores.Email ? "input-error" : ""}
              required 
            />
          </div>

          <div className="form-row">
            <label>Teléfono</label>
            <input 
              name="Phone" 
              placeholder='Ej: +54 9 11 0293 1325' 
              value={formData.Phone} 
              onChange={manejarCambio} 
            />
          </div>

          <div className="form-row">
            <label>Fecha Ingreso</label>
            <input name="JoinDate" type="date" value={formData.JoinDate} onChange={manejarCambio} required />
          </div>

          <div className="form-row">
            <label>Plan</label>
            <select name="PlanId" value={formData.PlanId} onChange={manejarCambio} required>
              <option value="">-- Seleccioná duración --</option>
              {PlanesPrueba.map((plan) => (
                <option key={plan.id} value={plan.id}>{plan.nombre} ({plan.dias} días)</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label>Vencimiento</label>
            <input name="EndDate" type="date" value={formData.EndDate} readOnly className="input-readonly" />
          </div>

          <div className="modal-footer-abajo">
            <button className='btn-registrar-pro' type='button' 
              onClick={() => { if(validarFase1()) { setFase(2); } }}>Siguiente</button>
          </div>
        </div>
      )}

      {fase === 2 && (
        <div className="fase-patologias animate-fade-in">
          <p className="instruccion-fase">Completa los siguientes campos:</p>
          <h3 className="titulo-fase">Antecedentes Médicos</h3>
          <p className="subtitulo-fase">Seleccioná las patologías que correspondan:</p>
          
          <div className="grid-patologias-limpio">
            {PATOLOGIAS_DB.map((pat) => (
              <label key={pat.id} className="item-patologia">
                <input 
                  type="checkbox" 
                  checked={patologiasSeleccionadas.includes(pat.id)}
                  onChange={() => {
                    setPatologiasSeleccionadas(prev => 
                      prev.includes(pat.id) 
                        ? prev.filter(id => id !== pat.id) 
                        : [...prev, pat.id]
                    );
                  }}
                />
                <span className='custom-checkbox'></span>
                <span className="nombre-patologia">{pat.nombre}</span>
              </label>
            ))}
          </div>

          <div className="modal-footer-abajo">
            <button type="button" className="btn-volver-minimal" onClick={() => setFase(1)}>
              Volver
            </button>
            <button type="submit" className="btn-registrar-pro">
              {socioExistente ? 'Actualizar Socio' : 'Registrar Socio'}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

export default FormularioSocio;