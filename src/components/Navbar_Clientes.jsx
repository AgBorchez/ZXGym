import { Link, NavLink } from 'react-router-dom';
 import '../styles/components/Navbar.css';

const NavbarPublico = () => (
    <>
  <nav className="main-nav">
    <div className="nav-container">
        <Link to="/" className="logo">ZX<span>Gym</span></Link>
        <div className="nav-links">
          <ul className="nav-links">
            <li><NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>Inicio</NavLink></li>
            <li><NavLink to="/entrenamiento" className={({ isActive }) => isActive ? "active" : ""}>Entrenamiento</NavLink></li>
            <li><NavLink to="/clases" className={({ isActive }) => isActive ? "active" : ""}>Clases</NavLink></li>
            <li><NavLink to="/planes" className={({ isActive }) => isActive ? "active" : ""}>Planes</NavLink></li>
            <li><NavLink to="/contacto" className={({ isActive }) => isActive ? "active" : ""}>Contacto</NavLink></li>
          </ul>
          <div className="nav-auth">
          <Link to="/login" className="btn-login">Ingresar</Link>
          </div>
        </div>
    </div>
  </nav>
 <div className="nav-spacer"></div>
  </>
);

export default NavbarPublico;