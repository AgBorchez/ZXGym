import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/pages/Inicio/Login.css';
import { API_USUARIOS_URL } from '../../Constants/config';
import { useAuth } from '../../context/AuthContext'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(''); // Estado para manejar errores visualmente
  const navigate = useNavigate();
  
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Limpiamos errores previos

    try {
      const response = await fetch(`${API_USUARIOS_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- LÓGICA DE CONTRASEÑA PENDIENTE ---
        if (data.status === "PENDING_PASSWORD") {
          // Redirigimos a la página de configuración de clave pasando el DNI
          // Usamos el DNI que viene del back para identificar al usuario
          navigate(`/set-password/${data.dni}`, { 
            state: { message: "Es tu primer ingreso. Por favor, configurá tu contraseña." } 
          });
          return;
        }

        // --- LOGIN EXITOSO ---
        login(data); 

        // Redirección por rol
        if (data.tipo === "Manager" || data.tipo === "Entrenador") {
          navigate('/socios');
        } else {
          navigate('/'); // Home para socios normales
        }

      } else {
        setError(data.message || "Email o contraseña incorrectos");
      }
    } catch (err) {
      console.error('Error de red:', err);
      setError("No se pudo conectar con el servidor.");
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
          {error && (
            <div className="form-error-msg" style={{ marginBottom: '15px', textAlign: 'center', marginLeft: 0 }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="ejemplo@zxgym.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={error ? "form-input-invalid" : ""}
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
              className={error ? "form-input-invalid" : ""}
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