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
    console.log("token:", token)
    e.preventDefault();
    setLoading(true);

    // Payload para RegisterStaffRequest en C#
    const dataToSubmit = {
      dni: parseInt(formData.dni),
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      type: "Manager", // Forzamos el rol para el backend
      Token: token     // El token enviado por el Manager actual
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
        // 1. Obtenemos el texto plano primero
        const textError = await response.text();
        console.log("Cuerpo del error crudo:", textError);

        try {
          // 2. Intentamos convertirlo a objeto
          const errorData = JSON.parse(textError);
          
          // 3. Buscamos el mensaje en cualquier variante posible
          const finalMsg = errorData.message || errorData.title || textError || "Error desconocido";
          alert(`Error: ${finalMsg}`);
        } catch (e) {
          // 4. Si no es JSON, mostramos el texto que llegó
          alert(`Error del servidor: ${textError}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
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
          
          {/* PASO 1: ACCESO ADMINISTRATIVO */}
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
                <input name="confirmPassword" type="password" placeholder="••••••••" onChange={handleChange} value={formData.confirmPassword} required />
              </div>
              <button type="submit" className="btn-login-submit">Siguiente</button>
            </>
          )}

          {/* PASO 2: DATOS PERSONALES */}
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
                <input name="dni" type="number" onChange={handleChange} value={formData.dni} required />
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