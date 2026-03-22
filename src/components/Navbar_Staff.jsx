import '../styles/components/Navbar.css';
import { Link, NavLink } from 'react-router-dom';

function Navbar_Staff() {
  return (
    <>
      <nav className="main-nav"> 
        <div className="nav-container">
          <NavLink to="/" className="logo">ZXGym</NavLink>
          
          <ul className="nav-links">
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
            <li><a href="#">Planes</a></li>
          </ul>
        </div>
      </nav>
      {/* Este div evita que el título "Gestión de Socios" se meta atrás de la barra */}
      <div className="nav-spacer"></div>
    </>
  );
}

export default Navbar_Staff;