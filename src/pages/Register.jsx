import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/pages/Login.css'; // Reutilizamos los estilos base

const Register = () => {
    const { token } = useParams(); // Obtenemos el token de la URL
    const [role, setRole] = useState('socio'); // Por defecto es socio
    const [isValidToken, setIsValidToken] = useState(true);

  useEffect(() => {
  const validarToken = async () => {
    if (token) {
      try {
        // Opcional: Podés pegarle a un endpoint de validación rápida
        // const resp = await fetch(`.../validar-token/${token}`);
        
        // Lógica por prefijos (como charlábamos)
        if (token.startsWith('TR-')) {
          setRole('entrenador');
        } else if (token.startsWith('MN-')) {
          setRole('manager');
        } else {
          setIsValidToken(false);
        }
      } catch (err) {
        setIsValidToken(false);
      }
    } else {
      setRole('socio'); // Si no hay token, es un registro público
    }
  };

  validarToken();
}, [token]);

  if (token && !isValidToken) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h2>Enlace inválido</h2>
          <p>Este código de invitación no existe o ya fue utilizado.</p>
          <Link to="/" className="btn-login-submit">Volver al inicio</Link>
        </div>
      </div>
      );
    }


  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 1. Validación de seguridad en el cliente
  if (formData.password !== formData.confirmPassword) {
    alert("Las contraseñas no coinciden");
    return;
  }

  // 2. Preparar el objeto para el Back (incluyendo el rol detectado)
  const dataToSubmit = {
    nombre: formData.nombre,
    email: formData.email,
    password: formData.password,
    rol: role, // 'socio', 'entrenador' o 'manager'
    token: token || null // Enviamos el token si existe para validar en el Back
  };

  try {
    const response = await fetch('https://tu-api-dotnet.com/api/usuarios/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (response.ok) {
      const result = await response.json();
      alert("¡Registro exitoso! Ya podés iniciar sesión.");
      // Aquí podrías usar useNavigate de react-router-dom para mandarlo al /login
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message || 'No se pudo completar el registro'}`);
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    alert("Hubo un problema al conectar con el servidor.");
  }
};

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          <h2>{role === 'socio' ? 'Creá tu cuenta' : `Registro de ${role}`}</h2>
          <p>Unite a la comunidad de ZXGym hoy mismo</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              name="nombre"
              type="text" 
              placeholder="Juan Pérez" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              name="email"
              type="email" 
              placeholder="tu@email.com" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Tipo de Cuenta</label>
            <input 
              type="text" 
              value={role.charAt(0).toUpperCase()+ role.slice(1)} 
              readOnly 
              className="form-input-readonly"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input 
              name="confirmPassword"
              type="password" 
              placeholder="••••••••" 
              onChange={handleChange}
              required 
            />
          </div>

          <button type="submit" className="btn-login-submit">
            Registrarse
          </button>
        </form>

        <div className="login-footer">
          <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;