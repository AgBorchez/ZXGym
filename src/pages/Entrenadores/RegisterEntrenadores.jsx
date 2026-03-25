import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../../styles/pages/Inicio/Login.css';
import { API_ENTRENADORES_URL } from '../../Constants/config';

const RegisterEntrenador = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    dni: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    shift: 'Mañana',
    rcpExpirationDate: ''
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
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSubmit = {
      dni: parseInt(formData.dni),
      name: formData.name,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      specialty: formData.specialty,
      shift: formData.shift,
      rcpExpirationDate: new Date(formData.rcpExpirationDate).toISOString(),
      token: token
    };

    try {
      const response = await fetch(`${API_ENTRENADORES_URL}/register-Entrenador`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      if (response.ok) {
        alert("¡Registro exitoso! Bienvenido al staff de ZXGym.");
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'No se pudo completar el registro'}`);
      }
    } catch (error) {
      alert("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          <h2>{step === 1 ? 'Registro de Staff' : 'Perfil Profesional'}</h2>
          <p className="token-indicator">Invitación: <strong>{token}</strong></p>
        </div>

        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="login-form">
          {step === 1 && (
            <>
              <div className="form-group">
                <label>Email Laboral</label>
                <input name="email" type="email" placeholder="staff@zxgym.com" onChange={handleChange} value={formData.email} required />
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

              <div className="form-group">
                <label>Especialidad</label>
                <input name="specialty" type="text" placeholder="Ej: Crossfit, Musculación..." onChange={handleChange} value={formData.specialty} required />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Turno</label>
                  <select name="shift" onChange={handleChange} value={formData.shift}>
                    <option value="Mañana">Mañana</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noche">Noche</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Vencimiento RCP</label>
                  <input name="rcpExpirationDate" type="date" onChange={handleChange} value={formData.rcpExpirationDate} required />
                </div>
              </div>

              <div className="login-actions">
                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
                <button type="submit" className="btn-login-submit" disabled={loading}>
                  {loading ? 'Validando...' : 'Completar Registro'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterEntrenador;