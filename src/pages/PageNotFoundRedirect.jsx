import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PageNotFoundRedirect = () => {
  const { user } = useAuth();

  // 1. Si no está logueado, lo mandamos al Home público
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. Si es Manager, cualquier error de URL lo manda a Usuarios
  if (user.tipo === 'Manager') {
    return <Navigate to="/usuarios" replace />;
  }

  // 3. Si es Entrenador, lo manda a su panel de alumnos
  if (user.tipo === 'Entrenador') {
    return <Navigate to="/alumnos" replace />;
  }

  // 4. Para cualquier otro caso (Socio logueado), al Home
  return <Navigate to="/" replace />;
};

export default PageNotFoundRedirect;