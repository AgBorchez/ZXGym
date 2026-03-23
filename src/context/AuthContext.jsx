import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Efecto de Carga Inicial
    useEffect(() => {
        const checkAuth = () => {
            try {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (error) {
                console.error("Error leyendo el localStorage", error);
                localStorage.removeItem('user'); // Si está corrupto, lo limpiamos
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // 2. Sincronización entre pestañas
        // Si cierro sesión en una pestaña, se cierra en todas
        const syncLogout = (e) => {
            if (e.key === 'user' && !e.newValue) {
                setUser(null);
            }
        };
        window.addEventListener('storage', syncLogout);
        return () => window.removeEventListener('storage', syncLogout);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        // Opcional: Podés forzar un reload o dejar que el ProtectedRoute redirija
        window.location.href = '/login'; 
    };

    const isStaff = user && (user.tipo === 'Manager' || user.tipo === 'Entrenador');
    const isManager = user?.tipo === 'Manager';
    const isSocio = user?.tipo === 'Socio';

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            logout, 
            loading, 
            isStaff, 
            isManager, 
            isSocio 
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

export default AuthContext;