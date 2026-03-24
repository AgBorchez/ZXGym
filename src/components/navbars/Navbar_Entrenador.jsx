import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/Navbar.css';

function Navbar_Entrenador() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="main-nav"> 
        <div className="nav-container">
          {/* Logo con el estilo ZXGym Staff */}
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          
          {/* Envoltorio principal para alinear links y auth igual que en Staff */}
          <div className="nav-links"> 
            <ul className="nav-links">
              <li>
                <NavLink to="/alumnos" className={({ isActive }) => isActive ? "active" : ""}>
                  Mis Alumnos
                </NavLink>
              </li>
              <li>
                <NavLink to="/clases" className={({ isActive }) => isActive ? "active" : ""}>
                  Mis Clases
                </NavLink>
              </li>
            </ul>

            {/* Sección de Auth a la derecha */}
            <div className="nav-auth">
              {user && (
                <div className="user-logged-info">
                  {/* Mantenemos el prefijo para consistencia visual */}
                  <span className="user-name">Entrenador: {user.nombre}</span>
                  <button onClick={logout} className="btn-logout-nav">
                    Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Spacer para evitar que el contenido quede debajo de la nav fixed */}
      <div className="nav-spacer"></div>
    </>
  );
}

export default Navbar_Entrenador;