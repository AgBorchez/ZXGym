import '../../styles/components/Navbar.css';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importamos el contexto

function Navbar_Staff() {
  const { user, logout } = useAuth();

  // Verificamos si es Manager para mostrar u ocultar la pestaña "Usuarios"
  const isManager = user && user.tipo === 'Manager';

  return (
    <>
      <nav className="main-nav"> 
        <div className="nav-container">
          {/* Logo a la izquierda */}
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          
          {/* IMPORTANTE: Agregamos este div envoltorio 
              para que el CSS de la nav pública funcione igual 
          */}
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

            {/* La parte de Auth (Nombre + Salir) a la derecha */}
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