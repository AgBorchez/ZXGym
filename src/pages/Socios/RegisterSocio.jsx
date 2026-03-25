import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/pages/Inicio/Login.css';
import { API_SOCIOS_URL } from '../../Constants/config';

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

const RegisterSocio = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [patologiasSeleccionadas, setPatologiasSeleccionadas] = useState([]);

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

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return passwordRegex.test(password);
  };

  const validateDni = (dni) => {
    const dniRegex = /^\d{7,8}$/;
    return dniRegex.test(dni);
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength <= 2) return phoneNumber;
    if (phoneNumberLength <= 6) return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2)}`;
    return `${phoneNumber.slice(0, 2)} ${phoneNumber.slice(2, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePatologia = (id) => {
    setPatologiasSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
      if (!validatePassword(formData.password)) {
        alert("La contraseña no cumple con los requisitos de seguridad.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!validateDni(formData.dni)) {
        alert("DNI inválido.");
        return;
      }
      if (formData.phone.length < 10) {
        alert("Teléfono incompleto.");
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      name: formData.name,
      lastName: formData.lastName,
      dni: parseInt(formData.dni),
      email: formData.email,
      phone: formData.phone,
      planId: parseInt(formData.planId),
      password: formData.password,
      Patologias: patologiasSeleccionadas 
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
          <h2>
            {step === 1 && 'Unite a la comunidad'}
            {step === 2 && 'Completá tu perfil'}
            {step === 3 && 'Ficha Médica'}
          </h2>
          <p className="step-indicator">Paso {step} de 3</p>
        </div>

        <form onSubmit={step < 3 ? handleNextStep : handleSubmit} className="login-form">

          {step === 1 && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input name="email" type="email" placeholder="ejemplo@correo.com" onChange={handleChange} value={formData.email} required />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input 
                  name="password" type="password" 
                  placeholder="Mín. 8 caracteres (Mayús, Núm, Especial)" 
                  onChange={handleChange} value={formData.password} required 
                  className={formData.password && !validatePassword(formData.password) ? 'input-error' : ''}
                />
                {formData.password && !validatePassword(formData.password) && (
                  <span className="error-text">Requisitos: 8+ caracteres, Mayúscula, Número y Símbolo.</span>
                )}
              </div>
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input 
                  name="confirmPassword" type="password" placeholder="••••••••" 
                  onChange={handleChange} value={formData.confirmPassword} required 
                  className={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'input-error' : ''}
                />
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
                  name="dni" type="text" inputMode="numeric" placeholder="Ej: 40123456" 
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 8) handleChange({ target: { name: 'dni', value } });
                  }} 
                  value={formData.dni} required 
                />
              </div>

              <div className="form-group">
                <label>Teléfono</label>
                <input 
                  name="phone" type="text" inputMode="numeric" placeholder="11 1234-5678" 
                  value={formatPhoneNumber(formData.phone)} required 
                  onChange={(e) => {
                    const soloNumeros = e.target.value.replace(/\D/g, "");
                    if (soloNumeros.length <= 10) handleChange({ target: { name: 'phone', value: soloNumeros } });
                  }} 
                />
              </div>

              <div className="form-group">
                <label>Plan</label>
                <select name="planId" onChange={handleChange} value={formData.planId} className="form-input">
                  <option value="1">Plan Inicial (1 Mes)</option>
                  <option value="3">Plan Trimestral (3 Meses)</option>
                  <option value="6">Plan Semestral (6 Meses)</option>
                  <option value="12">Plan Anual (12 Meses)</option>
                </select>
              </div>

              <div className="login-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
                <button type="submit" className="btn-login-submit">Siguiente</button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="login-fase-medical">
              <p className="subtitulo-fase">Seleccioná si poseés alguna condición:</p>
              
              <div className="patologias-grid-clean">
                {PATOLOGIAS_DB.map((pat) => (
                  <label key={pat.id} className="patologia-item">
                    <input 
                      type="checkbox" 
                      checked={patologiasSeleccionadas.includes(pat.id)}
                      onChange={() => togglePatologia(pat.id)}
                    />
                    <div className="patologia-box">
                      <span className="patologia-nombre">{pat.nombre}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="login-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(2)}>Atrás</button>
                <button type="submit" className="btn-login-submit" disabled={loading}>
                  {loading ? 'Procesando...' : 'Finalizar Registro'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterSocio;