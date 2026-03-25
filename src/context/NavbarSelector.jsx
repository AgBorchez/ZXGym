import { useAuth } from './context/AuthContext';
import NavbarPublico from './components/Navbar_Clientes';
import Navbar_Staff from './components/Navbar_Staff';
import Navbar_Entrenador from './components/Navbar_Entrenador';

const NavbarSelector = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) return <NavbarPublico />;

  switch (user.tipo) {
    case 'Manager':
      return <Navbar_Staff />;
    case 'Entrenador':
      return <Navbar_Entrenador />;
    case 'Socio':
      return <NavbarPublico />;
    default:
      return <NavbarPublico />;
  }
};

export default NavbarSelector;