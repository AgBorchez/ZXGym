import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/Navbar.css';

const NavbarPublico = () => {
  const { user, logout } = useAuth();

  // Definimos si es un socio logueado para reutilizar la lógica
  const isMember = user && user.tipo === 'Socio';

  return (
    <>
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          <div className="nav-links">
            <ul className="nav-links">
              {/* Siempre visible */}
              <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Inicio</NavLink></li>
              
              {/* Visible para Todos (o podés ocultarlo para visitantes si preferís) */}
              

              {/* OPCIONES SOLO PARA VISITANTES (Se ocultan si ya es socio) */}
              {!isMember && (
                <>
                <li><NavLink to="/entrenamiento" className={({ isActive }) => isActive ? "active" : ""}>Entrenamiento</NavLink></li>
                  <li><NavLink to="/contacto" className={({ isActive }) => isActive ? "active" : ""}>Contacto</NavLink></li>
                </>
              )}

              {/* OPCIONES EXCLUSIVAS PARA MIEMBROS */}
              {isMember && (
                <>
                  <li><NavLink to="/mi-perfil" className={({ isActive }) => isActive ? "active" : ""}>Mi Perfil</NavLink></li>
                  {/* Podrías agregar aquí "Mis Rutinas" o "Pagos" en el futuro */}
                </>
              )}
            </ul>

            <div className="nav-auth">
              {user ? (
                <div className="user-logged-info">
                  <span className="user-name">Hola, {user.nombre}</span>
                  <button onClick={logout} className="btn-logout-nav">Salir</button>
                </div>
              ) : (
                <Link to="/login" className="btn-login">Ingresar</Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div className="nav-spacer"></div>
    </>
  );
};

export default NavbarPublico;