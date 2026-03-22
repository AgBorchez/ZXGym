import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí irá tu fetch a la API de .NET
    console.log('Login intentado con:', { email, password });
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
            />
          </div>

          <button type="submit" className="btn-login-submit">
            Ingresar
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tenés cuenta? <Link to="/register">Contactanos</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;