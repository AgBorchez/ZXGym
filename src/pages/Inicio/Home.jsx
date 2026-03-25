import React from 'react';
import '../../styles/pages/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    { title: 'Musculación', desc: 'Equipamiento profesional', icon: '' },
    { title: 'Crossfit', desc: 'Entrenamientos funcionales', icon: '' },
    { title: 'Yoga', desc: 'Cuerpo y mente en equilibrio', icon: '' },
    { title: 'Clases Grupales', desc: 'Motivación y energía', icon: '' },
  ];

  return (
    <div className="home-wrapper">
      <section className="hero-container">
        <div className="hero-background">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070" 
            alt="ZXGym Background" 
          />
        </div>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h1 className="hero-title">
            Superá tus <br />
            <span className="hero-red">límites.</span>
          </h1>
          <p className="hero-description">
            Potenciá tu entrenamiento con tecnología de punta y alcanzá tu <strong>mejor versión.</strong>
          </p>
          
          <div className="hero-buttons">
            <Link className="btn-main" to='/register'>Empezar ahora</Link>
            <button className="btn-secondary">Ver más</button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Alumnos activos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Clases semanales</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Acceso al sistema</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features-grid">
        {features.map((f, index) => (
          <div key={index} className="feature-card">
            <span className="feature-icon">{f.icon}</span>
            <div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;