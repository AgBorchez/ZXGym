import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

// Navbars
import NavbarPublico from './components/navbars/Navbar_Clientes';
import NavbarStaff from './components/navbars/Navbar_Staff'; // Esta es la de Manager
import NavbarEntrenador from './components/navbars/Navbar_Entrenador'; // La nueva

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Socios from './pages/Socios/Socios';
import Entrenadores from './pages/Entrenadores/Entrenadores';
import RegisterSocio from './pages/Socios/RegisterSocio';
import RegisterEntrenador from './pages/Entrenadores/RegisterEntrenadores';
import RegisterManager from './pages/Managers/RegisterManager';
import Usuarios from './pages/Managers/ControlUsuarios';
import ControlUsuarios from './pages/Managers/ControlUsuarios';

// --- EL SELECTOR DE NAVBAR ---
const NavbarSelector = () => {
  const { user, loading } = useAuth();

  // No mostramos nada mientras React lee el localStorage para evitar parpadeos
  if (loading) return null;

  // 1. Si no hay usuario, es un visitante
  if (!user) return <NavbarPublico />;

  // 2. Lógica por Rol
  switch (user.tipo) {
    case 'Manager':
      return <NavbarStaff />;
    case 'Entrenador':
      return <NavbarEntrenador />;
    case 'Socio':
      return <NavbarPublico />; // El componente interno ya sabe mostrar "Hola, agustin"
    default:
      return <NavbarPublico />;
  }
};

function App() {
  return (
    <AuthProvider>
      <NavbarSelector />
      <div className="container-principal">
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterSocio />} />
          
          {/* REGISTROS POR INVITACIÓN (Staff) */}
          <Route path="/register-entrenador/:tokenSucio" element={<RegisterEntrenador />} />
          <Route path="/register-manager/:tokenSucio" element={<RegisterManager />} />

          {/* RUTAS PROTEGIDAS (Solo Staff) */}
          <Route 
            path="/socios" 
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Entrenador']}>
                <Socios />
              </ProtectedRoute>
            } 
          />

          <Route path="/entrenadores" element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <Entrenadores />
              </ProtectedRoute>} 
          />
          
          <Route path="/usuarios" element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <ControlUsuarios />
              </ProtectedRoute>} />

              

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;