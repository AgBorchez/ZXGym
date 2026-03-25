import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../styles/pages/Inicio/Login.css';
import { API_USUARIOS_URL } from '../../Constants/config';

const RegisterManager = () => {
  const { tokenSucio } = useParams();
  const token = tokenSucio
    ? (tokenSucio.startsWith(':') ? tokenSucio.slice(1) : tokenSucio)
    : "";
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    dni: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // --- LÓGICA DE VALIDACIÓN UNIFICADA ---
  const validateDni = (dni) => {
    const dniRegex = /^\d{7,8}$/;
    return dniRegex.test(dni);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (formData.password.length < 6) {
      alert("La contraseña debe ser de al menos 6 caracteres.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDni(formData.dni)) {
      alert("Por favor, ingresá un DNI válido (7 u 8 dígitos).");
      return;
    }

    setLoading(true);

    const dataToSubmit = {
      dni: parseInt(formData.dni),
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      type: "Manager",
      Token: token
    };

    try {
      const response = await fetch(`${API_USUARIOS_URL}/register-Manager`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        alert("¡Registro de Manager exitoso! Ya podés gestionar el gimnasio.");
        navigate('/login');
      } else {
        const textError = await response.text();
        try {
          const errorData = JSON.parse(textError);
          const finalMsg = errorData.message || errorData.title || textError || "Error desconocido";
          alert(`Error: ${finalMsg}`);
        } catch (e) {
          alert(`Error del servidor: ${textError}`);
        }
      }
    } catch (error) {
      alert("Error de conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          <h2>{step === 1 ? 'Registro de Administración' : 'Datos del Manager'}</h2>
          <p className="token-indicator">Invitación activa: <strong>{token}</strong></p>
        </div>

        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="login-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Email Corporativo</label>
                <input name="email" type="email" placeholder="admin@zxgym.com" onChange={handleChange} value={formData.email} required />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input name="password" type="password" placeholder="••••••••" onChange={handleChange} value={formData.password} required />
              </div>
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input 
                  name="confirmPassword" 
                  type="password" 
                  placeholder="••••••••" 
                  onChange={handleChange} 
                  value={formData.confirmPassword} 
                  required 
                  className={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-error' : ''}
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <span className="error-text">Las contraseñas no coinciden</span>
                )}
              </div>
              <button type="submit" className="btn-login-submit">Siguiente</button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Nombre</label>
                  <input name="name" type="text" onChange={handleChange} value={formData.name} required />
                </div>
                <div className="form-group flex-1">
                  <label>Apellido</label>
                  <input name="lastName" type="text" onChange={handleChange} value={formData.lastName} required />
                </div>
              </div>
              
              <div className="form-group">
                <label>DNI</label>
                <input 
                  name="dni" 
                  type="text" 
                  inputMode="numeric"
                  placeholder="Ej: 40123456"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 8) handleChange({ target: { name: 'dni', value } });
                  }} 
                  value={formData.dni} 
                  required 
                />
                {formData.dni && !validateDni(formData.dni) && (
                  <span className="error-text">Debe tener 7 u 8 dígitos</span>
                )}
              </div>

              <div className="login-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
                <button type="submit" className="btn-login-submit" disabled={loading}>
                  {loading ? 'Procesando...' : 'Crear Cuenta Manager'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterManager;