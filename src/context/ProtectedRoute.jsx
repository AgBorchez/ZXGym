import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Cargando...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    // Si pasamos roles permitidos (ej: ['Manager']), verificamos
    if (allowedRoles && !allowedRoles.includes(user.tipo)) {
        return <Navigate to="/" />; // O a una página de "No autorizado"
    }

    return children;
};

export default ProtectedRoute;