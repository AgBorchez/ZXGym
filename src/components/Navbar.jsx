import '../styles/Navbar.css';

function Navbar() {
  return (
    <>
      <nav className="main-nav"> 
        <div className="nav-container">
          <a href="/" className="logo">ZXGym</a>
          
          <ul className="nav-links">
            <li className="dropdown">
              <a href="#" className="active">Socios</a>
              <ul className="dropdown-content">
                <li><a href="#">Datos Generales</a></li>
                <li><a href="#">Patologías</a></li>
              </ul>
            </li>
            <li><a href="#">Entrenadores</a></li>
            <li><a href="#">Planes</a></li>
          </ul>
        </div>
      </nav>
      {/* Este div evita que el título "Gestión de Socios" se meta atrás de la barra */}
      <div className="nav-spacer"></div>
    </>
  );
}

export default Navbar;