import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Importamos el contexto
import ProtectedRoute from './context/ProtectedRoute';

import NavbarStaff from './components/Navbar_Staff';
import NavbarPublico from './components/Navbar_Clientes';

import Home from './pages/Home';
import Login from './pages/Login';
import Socios from './pages/Socios';
import Entrenadores from './pages/Entrenadores';
import RegisterSocio from './pages/RegisterSocio';
import RegisterEntrenador from './pages/RegisterEntrenadores';
import RegisterManager from './pages/RegisterManager';

// Componente auxiliar para decidir qué Navbar mostrar
const NavbarSelector = () => {
  const { user } = useAuth();
  // Si no hay usuario o es "Socio", mostramos el público. 
  // Si es Manager o Entrenador, mostramos el de Staff.
  const isStaff = user && (user.tipo === 'Manager' || user.tipo === 'Entrenador');
  
  return isStaff ? <NavbarStaff /> : <NavbarPublico />;
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
          <Route path="/register-entrenador/:token" element={<RegisterEntrenador />} />
          <Route path="/register-manager/:token" element={<RegisterManager />} />

          {/* RUTAS PROTEGIDAS (Solo Staff) */}
          <Route 
            path="/socios" 
            element={
              <ProtectedRoute allowedRoles={['Manager', 'Entrenador']}>
                <Socios />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/entrenadores" 
            element={
              <ProtectedRoute allowedRoles={['Manager']}>
                <Entrenadores />
              </ProtectedRoute>
            } 
          />

          {/* Redirección por defecto si la ruta no existe */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;