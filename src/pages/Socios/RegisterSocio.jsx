import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/pages/Inicio/Login.css';
import { API_SOCIOS_URL } from '../../Constants/config';

const RegisterSocio = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    planId: 1,
    password: '',
    confirmPassword: ''
  });

  const validateDni = (dni) => {
    const dniRegex = /^\d{7,8}$/;
    return dniRegex.test(dni);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    return phoneRegex.test(phone);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength <= 2) {
      return phoneNumber;
    }
    if (phoneNumberLength <= 6) {
      return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2)}`;
    }
    return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden. Por favor, verificalas.");
      return;
    }
    if (formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDni(formData.dni)) {
      alert("Por favor, ingresá un DNI válido (7 u 8 dígitos, sin puntos).");
      return;
    }

    if (!validatePhone(formData.phone)) {
      alert("El formato del teléfono no es válido. Usá solo números, espacios o '+'.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const dataToSubmit = {
      name: formData.name,
      lastName: formData.lastName,
      dni: parseInt(formData.dni),
      email: formData.email,
      phone: formData.phone,
      planId: parseInt(formData.planId),
      password: formData.password
    };

    try {
      const response = await fetch(`${API_SOCIOS_URL}/register-socio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        alert("¡Bienvenido a ZXGym! Tu cuenta ha sido creada.");
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'No se pudo completar el registro'}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un problema al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          <h2>{step === 1 ? 'Unite a la comunidad' : 'Completá tu perfil'}</h2>
        </div>

        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="login-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" placeholder="ejemplo@correo.com" onChange={handleChange} value={formData.email} required />
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
                  <input name="name" type="text" placeholder="Juan" onChange={handleChange} value={formData.name} required />
                </div>
                <div className="form-group flex-1">
                  <label>Apellido</label>
                  <input name="lastName" type="text" placeholder="Pérez" onChange={handleChange} value={formData.lastName} required />
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

              <div className="form-group">
                <label>Teléfono (con característica)</label>
                <input 
                  name="phone" 
                  type="text" 
                  inputMode="numeric" 
                  placeholder="Ej: 11 1234-5678" 
                  value={formatPhoneNumber(formData.phone)} 
                  required 
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, "");
                    if (soloNumeros.length <= 10) {
                      handleChange({
                        target: {
                          name: 'phone',
                          value: soloNumeros
                        }
                      });
                    }
                  }} 
                  className={formData.phone && formData.phone.length > 0 && formData.phone.length < 10 ? 'input-error' : ''}
                />
                {formData.phone && formData.phone.length > 0 && formData.phone.length < 10 && (
                  <span className="error-text">Ingresá los 10 dígitos (ej: 11 1234-5678)</span>
                )}
              </div>

              <div className="form-group">
                <label>Elegí tu Plan</label>
                <select name="planId" onChange={handleChange} value={formData.planId} className="form-input">
                  <option value="1">Plan Inicial (1 Mes)</option>
                  <option value="3">Plan Trimestral (3 Meses)</option>
                  <option value="6">Plan Semestral (6 Meses)</option>
                  <option value="12">Plan Anual (12 Meses)</option>
                </select>
              </div>

              <div className="login-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
                <button type="submit" className="btn-login-submit" disabled={loading}>
                  {loading ? 'Procesando...' : 'Finalizar Registro'}
                </button>
              </div>
            </>
          )}
        </form>

        <div className="login-footer">
          <p>¿Ya sos socio? <Link to="/login">Iniciá sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSocio;