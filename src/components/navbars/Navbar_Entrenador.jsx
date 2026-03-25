import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/Navbar.css';

function Navbar_Entrenador() {
  const { user, logout } = useAuth();

  return (
    <>
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          
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

            <div className="nav-auth">
              {user && (
                <div className="user-logged-info">
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
      <div className="nav-spacer"></div>
    </>
  );
}

export default Navbar_Entrenador;