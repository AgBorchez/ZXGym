import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar_Staff from './components/Navbar_Staff';
import Socios from './pages/Socios'; // La nueva ubicación
import Entrenadores from './pages/Entrenadores'; // El que vas a crear
import Home from './pages/Home';
import { useState } from 'react';
import NavbarPublico from './components/Navbar_Clientes';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';

function App() {

const [IsAdmin, SetIsAdmin] = useState(false);

  return (
    <>
      {IsAdmin ? <Navbar_Staff /> : <NavbarPublico />}
      <div className="container-principal">
        <Routes>
          {/* Si entran a localhost:5173/ (vacío), los mandamos a /socios */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/socios" element={<Socios />} />
          <Route path="/entrenadores" element={<Entrenadores />} />
          <Route path='/register' element={<Register />}/>
        </Routes>
      </div>
    </>
  );
}

export default App;