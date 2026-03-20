import { Link } from 'react-router-dom';
 import '../styles/Navbar.css';

const NavbarPublico = () => (
    <>
  <nav className="navbar public">
    <div className="nav-container">
        <Link to="/" className="logo">ZXGym</Link>
        <div className="nav-links">
        <Link to="/login" className="btn-login">Ingresar</Link>
        </div>
    </div>
  </nav>
 <div className="nav-spacer"></div>
  </>
);

export default NavbarPublico;