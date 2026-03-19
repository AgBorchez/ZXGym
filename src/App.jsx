import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Socios from './pages/Socios'; // La nueva ubicación
import Entrenadores from './pages/Entrenadores'; // El que vas a crear

function App() {
  return (
    <>
      <Navbar />
      <div className="container-principal">
        <Routes>
          {/* Si entran a localhost:5173/ (vacío), los mandamos a /socios */}
          <Route path="/" element={<Navigate to="/socios" />} />
          
          <Route path="/socios" element={<Socios />} />
          <Route path="/entrenadores" element={<Entrenadores />} />
        </Routes>
      </div>
    </>
  );
}

export default App;