import { useEffect, useState } from 'react';
import { API_ENTRENADORES_URL } from '../../Constants/config.js';
import '../../styles/components/FormularioSocio/FormularioSocio.css';

const estadoInicial = {
  Name: '', LastName: '', Email: '', Phone: '',
  Specialty: '', Shift: '', JoinDate: '', RCPExpirationDate: '',
  IsActive: true
};

function FormularioEntrenador({ alGuardar, entrenadorExistente }) {
  const [formData, setFormData] = useState(estadoInicial);
  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (entrenadorExistente) {
      setFormData({
        ...entrenadorExistente,
        // Aseguramos que los nombres coincidan con el estado local
        Name: entrenadorExistente.name || entrenadorExistente.Name || '',
        LastName: entrenadorExistente.lastName || entrenadorExistente.LastName || '',
        Email: entrenadorExistente.email || entrenadorExistente.Email || '',
        Phone: entrenadorExistente.phone || entrenadorExistente.Phone || '',
        Specialty: entrenadorExistente.specialty || entrenadorExistente.Specialty || '',
        Shift: entrenadorExistente.shift || entrenadorExistente.Shift || '',
        JoinDate: entrenadorExistente.joinDate?.split('T')[0] || '',
        RCPExpirationDate: entrenadorExistente.rcpExpirationDate?.split('T')[0] || ''
      });
    } else {
      setFormData(estadoInicial);
    }
  }, [entrenadorExistente]);

  const validarCampos = () => {
    let nuevosErrores = {};
    if (!formData.Name) nuevosErrores.Name = "El nombre es obligatorio";
    if (!formData.LastName) nuevosErrores.LastName = "El apellido es obligatorio";
    if (!formData.Email) nuevosErrores.Email = "El email es obligatorio";
    if (!formData.Specialty) nuevosErrores.Specialty = "La especialidad es obligatoria";
    if (!formData.Shift) nuevosErrores.Shift = "Debes asignar un turno";
    
    // Nueva validación de Celular para evitar el Error 400 del Backend
    if (!formData.Phone) {
      nuevosErrores.Phone = "El celular es obligatorio";
    } else if (formData.Phone.length < 8) {
      nuevosErrores.Phone = "El número es demasiado corto";
    }
    
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errores[name]) setErrores({ ...errores, [name]: null });
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    if (!validarCampos()) return;

    const esEdicion = !!entrenadorExistente;
    // Usamos ID o DNI según manejes tu PK en Entrenadores
    const urlFinal = esEdicion ? `${API_ENTRENADORES_URL}/${formData.id || formData.dni}` : API_ENTRENADORES_URL;
    const metodo = esEdicion ? 'PUT' : 'POST';

    const datosParaCsharp = {
      ...formData,
      JoinDate: new Date(formData.JoinDate).toISOString(),
      RCPExpirationDate: new Date(formData.RCPExpirationDate).toISOString()
    };

    try {
      const res = await fetch(urlFinal, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosParaCsharp)
      });

      if (res.ok) {
        alert(esEdicion ? "Staff actualizado" : "Entrenador registrado");
        alGuardar();
      } else {
        const errData = await res.json();
        console.error("Error de validación del backend:", errData);
        alert("Error al guardar. Revisa la consola.");
      }
    } catch (error) {
      console.error("Error de red:", error);
    }
  };

  return (
    <form onSubmit={enviarFormulario} className="animate-fade-in">
      <div className="form-container-staff">
        
        <div className="form-row">
          <label>Nombre</label>
          <input name="Name" value={formData.Name} onChange={manejarCambio} className={errores.Name ? "input-error" : ""} />
        </div>
        
        <div className="form-row">
          <label>Apellido</label>
          <input name="LastName" value={formData.LastName} onChange={manejarCambio} className={errores.LastName ? "input-error" : ""} />
        </div>

        <div className="form-row">
          <label htmlFor="Specialty">Especialidad</label>
          <select 
            id="Specialty"
            name="Specialty" 
            value={formData.Specialty} 
            onChange={manejarCambio} 
            className={errores.Specialty ? "input-error" : ""}>
            <option value="">-- Seleccione una especialidad --</option>
            <option value="Musculación">Musculación</option>
            <option value="Crossfit">Crossfit</option>
            <option value="Funcional">Entrenamiento Funcional</option>
            <option value="Boxeo">Boxeo</option>
            {errores.Specialty && <span className="error-text">{errores.Specialty}</span>}
          </select>
        </div>

        <div className="form-row">
          <label>Turno</label>
          <select name="Shift" value={formData.Shift} onChange={manejarCambio} className={errores.Shift ? "input-error" : ""}>
            <option value="">-- Seleccionar --</option>
            <option value="Mañana">Mañana</option>
            <option value="Tarde">Tarde</option>
            <option value="Noche">Noche</option>
          </select>
        </div>

        {/* CAMPO CELULAR AGREGADO */}
        <div className="form-row">
          <label>Celular</label>
          <input 
            name="Phone" 
            type="text" 
            placeholder="Ej: 1123456789" 
            value={formData.Phone} 
            onChange={manejarCambio} 
            className={errores.Phone ? "input-error" : ""}
          />
        </div>
        {errores.Phone && <span className="error-text-formulario">{errores.Phone}</span>}

        <div className="form-row">
          <label>Fecha Ingreso</label>
          <input name="JoinDate" type="date" value={formData.JoinDate} onChange={manejarCambio} required />
        </div>

        <div className="form-row">
          <label>Vence RCP</label>
          <input name="RCPExpirationDate" type="date" value={formData.RCPExpirationDate} onChange={manejarCambio} required />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input name="Email" type="email" value={formData.Email} onChange={manejarCambio} className={errores.Email ? "input-error" : ""} />
        </div>

        <div className="modal-footer-abajo">
          <button type="submit" className="btn-registrar-pro">
            {entrenadorExistente ? 'Actualizar Entrenador' : 'Guardar Entrenador'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormularioEntrenador;