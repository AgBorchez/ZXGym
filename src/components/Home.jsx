import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="Home-presentation">
      <header className="hero">
        <h1>Bienvenido a ZXGym</h1>
        <p>Potencia tu entrenamiento con tecnología de punta.</p>
        <div className="features">
          <span>💪 Musculación</span>
          <span>🔥 Crossfit</span>
          <span>🧘 Yoga</span>
        </div>
        <Link title="Ir a Gestión" to="/Socios" className="btn-primary">
          Ingresar al Sistema
        </Link>
      </header>
    </div>
  );
};

export default Home;