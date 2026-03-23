import React from 'react';
import '../../styles/pages/Inicio/Entrenamiento.css'; 

const Entrenamiento = () => {
  const servicios = [
    {
      id: 1,
      titulo: "Pileta y Clases Acuáticas",
      descripcion: "Mejorá tu resistencia sin impacto. Natación nivel inicial y avanzado, Aquagym o nado libre en pileta climatizada.",
      imagenUrl: "https://images.pexels.com/photos/18167966/pexels-photo-18167966.jpeg",
      destacado: false
    },
    {
      id: 2,
      titulo: "Musculación",
      descripcion: "Programas específicos para ganar masa muscular y fuerza con las máquinas más modernas del mercado.",
      imagenUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop", 
      destacado: true 
    },
    {
      id: 3,
      titulo: "Entrenamiento Funcional",
      descripcion: "Mejorá tu agilidad, fuerza útil y resistencia con rutinas dinámicas de movimiento.",
      imagenUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop", 
      destacado: false
    }
  ];

  return (
    <div className="page-entrenamiento-dark">
      
      {/* 1. HERO SECTION */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>ENTRENAMIENTO</h1>
          <p>
            Lográ tus objetivos con nuestros entrenamientos especializados, 
            tecnología de punta y ahora, ¡nuestra pileta climatizada!
          </p>
          <button className="btn-rojo-pro">EXPLORA NUESTRO GIMNASIO</button>
        </div>
      </header>

      {/* 2. SECCIÓN DE SERVICIOS */}
      <section className="servicios-section">
        <h2>Nuestros Servicios de Entrenamiento</h2>
        <p className="subtitulo-seccion">
          Entrená con los mejores instructores y equipo de última generación. 
          Encontrá la actividad perfecta para alcanzar tus metas.
        </p>

        <div className="tarjetas-container">
          
          {servicios.map(servicio => (
            <div 
              key={servicio.id} 
              className={`tarjeta-servicio-pro ${servicio.destacado ? 'active' : ''}`}
              style={{ backgroundImage: `url(${servicio.imagenUrl})` }}
            >
              <div className="tarjeta-overlay"></div>

              <div className="tarjeta-content">
                {/* Se eliminó el icon-wrapper */}
                <h3>{servicio.titulo}</h3>
                <p>{servicio.descripcion}</p>
              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default Entrenamiento;