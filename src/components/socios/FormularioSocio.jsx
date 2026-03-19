import { useEffect, useState } from 'react';
import { API_SOCIOS_URL } from '../../Constants/config.js';
import '../../styles/FormularioSocio.css';

  const estadoInicial = {
    id ,DNI: '', Name: '', LastName: '', Email: '',
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
  const [errores, seterrores] = useState({});

  const validarFase1 = () => {
    let nuevosErrores = {}

    if (!formData.DNI) nuevosErrores.DNI = "El DNI es obligatorio";
    if (!formData.Name) nuevosErrores.Name = "El nombre es obligatorio";
    if (!formData.LastName) nuevosErrores.LastName = "El apellido es obligatorio";
    if (!formData.Email) nuevosErrores.Email = "El email es obligatorio";
    if (!formData.JoinDate) nuevosErrores.JoinDate = "La fecha de ingreso es obligatoria";
    if (!formData.PlanId) nuevosErrores.PlanId = "Debes seleccionar un plan";

    seterrores(nuevosErrores)

    return Object.keys(nuevosErrores).length === 0
  }

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    
    // 1. Creamos la "copia" con el dato nuevo
    let nuevoEstado = { ...formData, [name]: value };

    // 2. Lógica de cálculo de fecha (se ejecuta al cambiar PlanId o JoinDate)
    if (name === "PlanId" || name === "JoinDate") {
      // Buscamos el plan usando el ID que acaba de cambiar (value) o el que ya estaba
      const planIdABuscar = name === "PlanId" ? parseInt(value) : parseInt(nuevoEstado.PlanId);
      const planElegido = PlanesPrueba.find(p => p.id === planIdABuscar);
      
      if (planElegido && nuevoEstado.JoinDate) {
        const fechaInicio = new Date(nuevoEstado.JoinDate);
        // Sumamos los días del plan
        fechaInicio.setDate(fechaInicio.getDate() + planElegido.dias);
        
        // Formateamos la fecha a YYYY-MM-DD para que el input tipo date la entienda
        nuevoEstado.EndDate = fechaInicio.toISOString().split('T')[0];
      }
    }

    // 3. Actualizamos el estado con todo listo
    setFormData(nuevoEstado);
  };

  useEffect(() => {
    if(socioExistente && socioExistente.id !== formData.id) {
        setFormData({
            // 2. EVITAR UNDEFINED: Usamos || '' para que si el dato no viene, sea un string vacío
            DNI: socioExistente.dni || '',
            Name: socioExistente.name || '',
            LastName: socioExistente.lastName || '',
            Email: socioExistente.email || '',
            Phone: socioExistente.phone || '',
            PlanId: socioExistente.planId || '',
            JoinDate: socioExistente.joinDate ? socioExistente.joinDate.split('T')[0] : '',
            EndDate: socioExistente.endDate ? socioExistente.endDate.split('T')[0] : ''
        });
    } 

    if (!socioExistente && formData.id !== '') {
      setFormData(estadoInicial);
    }
    
  }, [socioExistente])

  // ENviar formulario Post - Put
  const enviarFormulario = async (e) => {
    e.preventDefault();
    
    const Edicion = !!socioExistente;
    const urlFinal = Edicion ? `${API_SOCIOS_URL}/${formData.id}` : API_SOCIOS_URL;
    const metodo = Edicion ? 'PUT' : 'POST';

    const datosParaCsharp = {
      ...formData,
      DNI: parseInt(formData.DNI),           
      PlanId: parseInt(formData.PlanId),     
      JoinDate: new Date(formData.JoinDate).toISOString(),
      EndDate: new Date(formData.EndDate).toISOString(),
      Patologias: patologiasSeleccionadas
    };

    try {
      const res = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaCsharp)
      });

      if (res.ok) {
        alert(Edicion ? "¡Socio actualizado con éxito!" : "¡Socio registrado con éxito!");
        setFormData(estadoInicial);
        setFase(1)
        alGuardar();
      } else {
        const errorTexto = await res.text();
        alert("Error al guardar: " + errorTexto);
      }
    } catch (error) {
      console.error("Error en la red:", error);
    }
  };

  return (
    <form onSubmit={enviarFormulario}>
      {fase === 1 && (
      <div>
        {/* Usamos la clase form-row para alinear Label a la izquierda e Input a la derecha */}
        
          {errores.DNI && <span className="error-text">{errores.DNI}</span>}
          <div className="form-row">
            <label>DNI</label>
            <input 
              name="DNI" 
              type="number"
              placeholder='Ej: 47892421' 
              value={formData.DNI} 
              onChange={(e) => { // Agregamos las llaves del cuerpo de la función
                manejarCambio(e); 
                // Si existe un error específicamente en DNI, lo limpiamos
                if (errores.DNI) {
                  setErrores({ ...errores, DNI: null });
                }
              }} 
              required 
              readOnly={!!socioExistente}
              className={socioExistente ? "input-readonly" : (errores.DNI ? "input-error" : "")}
            />
          </div>
          {/* No te olvides de poner el span acá abajo si querés ver el texto rojo */}
          

        {/* --- NOMBRE --- */}
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


          {/* --- APELLIDO --- */}
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


          {/* --- EMAIL --- */}
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


          {/* --- TELÉFONO --- */}
          <div className="form-row">
            <label>Teléfono</label>
            <input 
              name="Phone" 
              placeholder='Ej: +54 9 11 0293 1325' 
              value={formData.Phone} 
              onChange={(e) => {
                manejarCambio(e);
                if (errores.Phone) setErrores({ ...errores, Phone: null });
              }} 
              /* El teléfono suele ser opcional, pero si querés validarlo usá: 
                className={errores.Phone ? "input-error" : ""} */
            />
          </div>
          {/* {errores.Phone && <span className="error-text">{errores.Phone}</span>} */}

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
        onClick={() =>{if(validarFase1()) {setFase(2);} }}>Siguiente</button>
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
                    // Lógica para agregar o quitar el ID del array
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