import React, { useState } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { API_USUARIOS_URL } from '../../Constants/config';
import '../../styles/pages/Inicio/Login.css'; // Usamos tus nuevas clases de Login

const SetInitialPassword = () => {
    const { dni } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const welcomeMsg = location.state?.message || "Configurá tu nueva contraseña para acceder.";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_USUARIOS_URL}/set-initial-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    DNI: parseInt(dni),
                    Password: password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setError(data.message || "No se pudo establecer la contraseña.");
            }
        } catch (err) {
            setError("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <Link to="/" className="logo">ZX<span>Gym</span></Link>
                    <h2>{success ? "¡Todo listo!" : "Seguridad"}</h2>
                    <p>{success ? "Tu contraseña se configuró correctamente." : welcomeMsg}</p>
                </div>

                {success ? (
                    <div className="login-form">
                        <div style={{ padding: '20px 0', color: '#48bb78', fontSize: '1.2rem' }}>
                            <span style={{ fontSize: '3rem' }}>✔</span>
                            <p style={{ marginTop: '10px', color: '#ccc' }}>Redirigiendo al login...</p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        {/* Error visual usando tu clase */}
                        {error && (
                            <p style={{ color: '#ff4d4d', fontSize: '0.85rem', marginBottom: '10px', fontWeight: 'bold' }}>
                                {error}
                            </p>
                        )}

                        <div className="form-group">
                            <label>DNI del Usuario</label>
                            <input 
                                type="text" 
                                value={dni} 
                                readOnly 
                                style={{ opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#000' }}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nueva Contraseña</label>
                            <input 
                                type="password" 
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Confirmar Contraseña</label>
                            <input 
                                type="password" 
                                placeholder="Repetí tu clave"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="btn-login-submit" disabled={loading}>
                            {loading ? 'Procesando...' : 'Establecer Contraseña'}
                        </button>
                    </form>
                )}

                <div className="login-footer">
                    <p><Link to="/login">Volver al Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SetInitialPassword;