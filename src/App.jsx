import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar_Staff from './components/Navbar_Staff';
import Socios from './pages/Socios'; // La nueva ubicación
import Entrenadores from './pages/Entrenadores'; // El que vas a crear
import Home from './components/Home';
import { useState } from 'react';
import NavbarPublico from './components/Navbar_Clientes';

function App() {

const [IsAdmin, SetIsAdmin] = useState(false);

  return (
    <>
      {IsAdmin ? <Navbar_Staff /> : <NavbarPublico />}
      <div className="container-principal">
        <Routes>
          {/* Si entran a localhost:5173/ (vacío), los mandamos a /socios */}
          <Route path="/" element={<Home />} />
          
          <Route path="/socios" element={<Socios />} />
          <Route path="/entrenadores" element={<Entrenadores />} />
        </Routes>
      </div>
    </>
  );
}

export default App;