import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
const PageNotFoundRedirect = () => {
  const { user } = useAuth();

  // 1. Si no está logueado, lo mandamos al Home público o al Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. Si es Manager, cualquier error de URL lo manda a Usuarios
  if (user.tipo === 'Manager') {
    return <Navigate to="/usuarios" replace />;
  }

  // 3. Si es Entrenador, lo manda a Socios
  if (user.tipo === 'Entrenador') {
    return <Navigate to="/alumnos" replace />;
  }

  // 4. Para cualquier otro (Socio), al Home
  return <Navigate to="/" replace />;
};

export default PageNotFoundRedirect;