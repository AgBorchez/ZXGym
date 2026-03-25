import '../../styles/components/Navbar.css';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar_Staff() {
  const { user, logout } = useAuth();

  const isManager = user && user.tipo === 'Manager';

  return (
    <>
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          
          <div className="nav-links">
            <ul className="nav-links">
              {isManager && (
                <li>
                  <NavLink to="/usuarios" className={({ isActive }) => isActive ? "active" : ""}>
                    Usuarios
                  </NavLink>
                </li>
              )}
              <li>
                <NavLink to="/socios" className={({ isActive }) => isActive ? "active" : ""}>
                  Socios
                </NavLink>
              </li>
              <li>
                <NavLink to="/entrenadores" className={({ isActive }) => isActive ? "active" : ""}>
                  Entrenadores
                </NavLink>
              </li>
            </ul>

            <div className="nav-auth">
              {user && (
                <div className="user-logged-info">
                  <span className="user-name">Staff: {user.nombre}</span>
                  <button onClick={logout} className="btn-logout-nav">Salir</button>
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

export default Navbar_Staff;