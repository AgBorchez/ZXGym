import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/components/Navbar.css';

const NavbarPublico = () => {
  const { user, logout } = useAuth();

  const isMember = user && user.tipo === 'Socio';

  return (
    <>
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="logo">ZX<span>Gym</span></Link>
          <div className="nav-links">
            <ul className="nav-links">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                  Inicio
                </NavLink>
              </li>
              
              {!isMember && (
                <>
                  <li>
                    <NavLink to="/entrenamiento" className={({ isActive }) => isActive ? "active" : ""}>
                      Entrenamiento
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/contacto" className={({ isActive }) => isActive ? "active" : ""}>
                      Contacto
                    </NavLink>
                  </li>
                </>
              )}

              {isMember && (
                <>
                  <li>
                    <NavLink to="/mi-perfil" className={({ isActive }) => isActive ? "active" : ""}>
                      Mi Perfil
                    </NavLink>
                  </li>
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