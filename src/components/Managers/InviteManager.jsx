import React, { useState } from 'react';
import { API_USUARIOS_URL } from '../../Constants/config';
import '../../styles/components/invitaciones.css'; // El CSS de las tarjetas

const InviteManager = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateToken = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const response = await fetch(`${API_USUARIOS_URL}/generate-Manager-token`);
      const data = await response.json();
      if (response.ok) {
        setToken(data.managerCode);
      } else {
        alert("Error al generar token");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!token) return;
    const url = `${window.location.origin}/register-Manager/:${token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="invite-card-container">
      <h3>Invitar nuevo Manager</h3>
      
      {/* Badge de acceso total como en la imagen */}
      <div className="badge-acceso">
        <span className="icon-lock">Acceso total</span> 
      </div>
      
      <p className="invite-description">
        Este token permite registrar a un administrador con acceso total al sistema.
      </p>

      {/* Botón principal de acción */}
      <button 
        onClick={generateToken} 
        disabled={loading} 
        className="btn-action-main"
      >
        {loading ? 'Generando...' : 'Generar Nuevo Token'}
      </button>

      {/* Grupo de Token: Input + Botón Copiar pegados */}
      <div className="token-group">
        <input 
          type="text" 
          className="token-input-display" 
          value={token || "---- ---- ---- ----"} 
          readOnly 
          placeholder="Código de invitación"
        />
        <button 
          onClick={copyToClipboard} 
          className="btn-copy-group"
          disabled={!token}
        >
          {/* Icono simple de papel/copia */}
          <span className="icon-copy">📋</span> 
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
};

export default InviteManager;