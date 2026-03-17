import { useEffect, useState } from 'react';
import { API_SOCIOS_URL } from '../Constants/config.js';
import '../styles/FormularioSocio.css';

function FormularioSocio({ alGuardar, socioExistente }) {
  const estadoInicial = {
    DNI: '', Name: '', LastName: '', Email: '',
    Phone: '', JoinDate: '', EndDate: '', PlanId: ''
  };

  const PlanesPrueba = [
    { id: 1, nombre: "Mensual", dias: 30 },
    { id: 2, nombre: "Trimestral", dias: 90 },
    { id: 3, nombre: "Semestral", dias: 180 },
    { id: 4, nombre: "Anual", dias: 365 }
  ];

  const [formData, setFormData] = useState(estadoInicial);

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
    if(socioExistente && socioExistente.DNI !== formData.DNI) {
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

    if (!socioExistente && formData.DNI !== '') {
      setFormData(estadoInicial);
    }
    
  }, [socioExistente])

  // ENviar formulario Post - Put
  const enviarFormulario = async (e) => {
    e.preventDefault();
    
    const Edicion = !!socioExistente;
    const urlFinal = Edicion ? `${API_SOCIOS_URL}/${formData.DNI}` : API_SOCIOS_URL;
    const metodo = Edicion ? 'PUT' : 'POST';

    const datosParaCsharp = {
      ...formData,
      DNI: parseInt(formData.DNI),           
      PlanId: parseInt(formData.PlanId),     
      JoinDate: new Date(formData.JoinDate).toISOString(),
      EndDate: new Date(formData.EndDate).toISOString()
    };

    try {
      const res = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaCsharp)
      });

      if (res.ok) {
        alert(Edicion ? "¡Socio registrado con éxito!" : "¡Socio registrado con éxito!");
        setFormData(estadoInicial);
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
      {/* Usamos la clase form-row para alinear Label a la izquierda e Input a la derecha */}
      <div className="form-row">
        <label>DNI</label>
        <input 
          name="DNI" 
          type="number" 
          value={formData.DNI} 
          onChange={manejarCambio} 
          required 
          readOnly={!!socioExistente}
          className={socioExistente ? "input-readonly" : ""}
        />
      </div>

      <div className="form-row">
        <label>Nombre</label>
        <input name="Name" value={formData.Name} onChange={manejarCambio} required />
      </div>

      <div className="form-row">
        <label>Apellido</label>
        <input name="LastName" value={formData.LastName} onChange={manejarCambio} required />
      </div>

      <div className="form-row">
        <label>Email</label>
        <input name="Email" type="email" value={formData.Email} onChange={manejarCambio} required />
      </div>

      <div className="form-row">
        <label>Teléfono</label>
        <input name="Phone" value={formData.Phone} onChange={manejarCambio} />
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

      <div className="modal-footer">
        <button type="submit" className="btn-guardar-azul">
          {socioExistente ? 'Actualizar Socio' : 'Registrar Socio'}
        </button>
      </div>
    </form>
  );
}

export default FormularioSocio;