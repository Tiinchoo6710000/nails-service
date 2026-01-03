import React, { useState, useEffect } from "react";

const trabajos = [ 
  { id: 1, nombre: "Semipermanente", descripcion: "Uñas con gel y diseño minimalista.", imagen: "/images/semipermanente.jpg" },
  { id: 2, nombre: "Softgel", descripcion: "Duración 3 semanas.", imagen: "/images/softgel.jpg" },
  { id: 3, nombre: "Nail Art Creativo", descripcion: "Diseños personalizados y únicos.", imagen: "/images/creativo.jpg" },
  { id: 4, nombre: "Kapping con soft gel", descripcion: "Relajación y cuidado para tus pies.", imagen: "/images/kappingsoftgel1.jpg" },
];

export default function WorksSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % trabajos.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + trabajos.length) % trabajos.length);
  const next = () => setIndex((i) => (i + 1) % trabajos.length);

  return (
    <div className="section">
      <h2 className="titulo-trabajos">Trabajos realizados</h2>

      <div className="works-carousel">
        <button className="carousel-btn prev" onClick={prev} aria-label="Anterior">‹</button>

        <div className="carousel-viewport">
          <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
            {trabajos.map((t) => (
              <div key={t.id} className="work-card">
                <img src={t.imagen} alt={t.nombre} />
                <h3>{t.nombre}</h3>
                <p>{t.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-btn next" onClick={next} aria-label="Siguiente">›</button>
      </div>

      <div className="carousel-dots">
        {trabajos.map((_, i) => (
          <button
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={() => setIndex(i)}
            aria-label={`Ir a ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
