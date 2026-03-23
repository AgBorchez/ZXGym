import { useAuth } from './context/AuthContext';
import NavbarPublico from './components/Navbar_Clientes';
import Navbar_Staff from './components/Navbar_Staff';
import Navbar_Entrenador from './components/Navbar_Entrenador';

const NavbarSelector = () => {
  const { user, loading } = useAuth();

  // Mientras carga la sesión, no mostramos nada para evitar parpadeos
  if (loading) return null;

  // 1. Si no hay usuario, es el público general
  if (!user) return <NavbarPublico />;

  // 2. Selección por Rol
  switch (user.tipo) {
    case 'Manager':
      return <Navbar_Staff />;
    case 'Entrenador':
      return <Navbar_Entrenador />;
    case 'Socio':
      return <NavbarPublico />; // El socio usa la de clientes, pero el componente interno ya sabe mostrar "Mi Perfil"
    default:
      return <NavbarPublico />;
  }
};

export default NavbarSelector;