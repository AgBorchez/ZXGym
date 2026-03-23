import React, { useState } from 'react';
import '../../styles/pages/Inicio/Contacto.css'; 

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
    alert('¡Gracias por tu mensaje! Te responderemos pronto.');
    setFormData({ nombre: '', email: '', mensaje: '' }); 
  };

  return (
    <div className="page-contacto-dark">
      
      {/* 1. HERO SECTION */}
      <header className="contacto-hero">
        <div className="container-pro">
          <h1>CONTÁCTANOS</h1>
          <p>Ponte en contacto con nosotros</p>
        </div>
      </header>

      {/* 2. SECCIÓN PRINCIPAL */}
      <section className="contacto-main container-pro">
        <div className="text-center-pro">
            <h2>Estamos aquí para ayudarte</h2>
            <p className="subtitulo-seccion">
            ¿Quieres saber más o agendar una visita? Contáctanos y te responderemos lo antes posible.
            </p>
        </div>

        <div className="contacto-grid">
          
          {/* COLUMNA IZQUIERDA: Formulario */}
          <div className="contacto-form-wrapper">
            <h3>Envíanos un Mensaje</h3>
            <form onSubmit={handleSubmit} className="dark-form">
              <div className="form-group">
                <input 
                  type="text" 
                  name="nombre" 
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre y Apellido" 
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Correo Electrónico" 
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  name="mensaje" 
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Tu Mensaje" 
                  rows="6" 
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn-rojo-full">Enviar Mensaje</button>
            </form>
          </div>

          {/* COLUMNA DERECHA: Info */}
          <div className="contacto-info-wrapper">
            
            <div className="info-card-pro">
              <div className="icon-circle phone-icon">📞</div>
              <div className="info-text">
                <h4>Llámanos</h4>
                <p>+54 11 764-8437</p>
                <span className="info-sub">Contáctanos para información</span>
              </div>
            </div>

            <div className="info-card-pro">
              <div className="icon-circle email-icon">✉️</div>
              <div className="info-text">
                <h4>Email</h4>
                <p>info@zxgym.com</p>
                <span className="info-sub">Escríbenos para consultas</span>
              </div>
            </div>

            <div className="info-card-pro">
                <div className="icon-circle location-icon">📍</div>
                <div className="info-text">
                    <h4>Ubicación</h4>
                    <p>Av. Siempre Viva 742</p>
                    <span className="info-sub">Springfield, Argentina</span>
                </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Contacto;