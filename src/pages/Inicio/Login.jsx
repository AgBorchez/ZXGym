import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/pages/Inicio/Login.css';
import { API_USUARIOS_URL } from '../../Constants/config';
import { useAuth } from '../../context/AuthContext'; // 1. IMPORTAR EL HOOK

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // 2. EXTRAER LA FUNCIÓN LOGIN DEL CONTEXTO
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_USUARIOS_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === "PENDING_PASSWORD") {
          alert(data.message);
          navigate(`/set-password/${data.dni}`);
          return;
        }

        // --- EL CAMBIO MÁGICO ESTÁ ACÁ ---
        
        // 3. LLAMAR A LOGIN DEL CONTEXTO
        // Esto hace el localStorage.setItem Y ADEMÁS le avisa a React que el usuario existe.
        login(data); 

        // --------------------------------

        // Redirigir según el tipo
        if (data.tipo === "Manager") navigate('/socios'); // O tu dashboard de admin
        else if (data.tipo === "Entrenador") navigate('/socios'); 
        else navigate('/'); // Socio vuelve al home pero ya logueado

      } else {
        alert(data.message || "Email o contraseña incorrectos");
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