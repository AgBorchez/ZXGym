import React, { useState } from 'react';
import { API_USUARIOS_URL } from '../../Constants/config';
import '../../styles/components/Invitaciones.css'; // Mantenemos el mismo import

const InviteEntrenador = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateToken = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const response = await fetch(`${API_USUARIOS_URL}/generate-Entrenador-token`);
      const data = await response.json();
      if (response.ok) {
        setToken(data.entrenadorCode);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!token) return;
    const url = `${window.location.origin}/register-Trainer/:${token}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="invite-card-container">
      <h3>Invitar Entrenador</h3>
      
      {/* Badge diferente para distinguir del Manager al golpe de vista */}
      <div className="badge-acceso trainer-badge">
        <span>Staff Técnico</span> 
      </div>

      <p className="invite-description">
        Generá un código de invitación para que un nuevo profesor se una al staff del gimnasio.
      </p>

      {/* Botón principal (usamos la misma clase btn-action-main) */}
      <button 
        onClick={generateToken} 
        disabled={loading} 
        className="btn-action-main"
      >
        {loading ? 'Generando...' : 'Obtener Código'}
      </button>

      {/* Estructura de Token Group (Input + Botón pegados) */}
      <div className="token-group">
        <input 
          type="text" 
          className="token-input-display" 
          value={token || "---- ---- ---- ----"} 
          readOnly 
          placeholder="Código de entrenador"
        />
        <button 
          onClick={copyToClipboard} 
          className="btn-copy-group"
          disabled={!token}
        >
          <span className="icon-copy">📋</span> 
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>
    </div>
  );
};

export default InviteEntrenador;