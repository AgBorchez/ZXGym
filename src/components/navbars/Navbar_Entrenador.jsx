import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importante para el Logout y el Nombre
import '../../styles/components/Navbar.css';

function Navbar_Entrenador() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="main-nav"> 
        <div className="nav-container">
          <Link to="/" className="logo">ZX<span>Gym</span> Staff</Link>
          
          <ul className="nav-links">
            <li>
              <NavLink to="/socios" className={({ isActive }) => isActive ? "active" : ""}>
                Mis Alumnos
              </NavLink>
            </li>
            <li>
              <NavLink to="/clases" className={({ isActive }) => isActive ? "active" : ""}>
                Mis Clases
              </NavLink>
            </li>
            {/* Quitamos "Entrenadores" porque un entrenador no gestiona a sus pares */}
          </ul>

          <div className="nav-auth">
            <div className="user-logged-info">
              <div className="user-badge">
                <span className="user-name">{user?.nombre}</span>
                <span className="user-role">Entrenador</span>
              </div>
              <button onClick={logout} className="btn-logout-nav">
                Salir
              </button>
            </div>
          </div>
        </div>
      </nav>
      {/* Mantenemos el spacer para que el contenido no se pegue arriba */}
      <div className="nav-spacer"></div>
    </>
  );
}

export default Navbar_Entrenador;