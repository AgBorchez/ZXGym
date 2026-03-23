import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pages/Login.css';
import { API_USUARIOS_URL } from '../Constants/config'; // Asegurate que esta URL sea la base de tu API

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_USUARIOS_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // CASO 1: El usuario debe configurar su contraseña (tu lógica de PENDING_PASSWORD)
        if (data.status === "PENDING_PASSWORD") {
          alert(data.message);
          // Redirigir a una página de "Set Password" pasando el DNI
          navigate(`/set-password/${data.dni}`);
          return;
        }

        // CASO 2: Login exitoso
        console.log('Usuario autenticado:', data);
        
        // Guardamos los datos básicos en localStorage (Temporalmente, hasta usar JWT)
        localStorage.setItem('user', JSON.stringify(data));

        // Redirigir según el tipo de usuario (Manager, Entrenador o Socio)
        if (data.tipo === "Manager") navigate('/admin/dashboard');
        else if (data.tipo === "Entrenador") navigate('/staff/dashboard');
        else navigate('/dashboard');

      } else {
        // CASO 3: Error (Unauthorized u otros)
        alert(data.message || "Error al iniciar sesión");
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresá tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="ejemplo@zxgym.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-login-submit" disabled={loading}>
            {loading ? 'Verificando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tenés cuenta? <Link to="/register">Registrate acá</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;