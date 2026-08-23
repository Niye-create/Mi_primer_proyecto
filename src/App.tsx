import { TarjetaTramite } from './components/TarjetaTramite';
import { Droplets, Trash2, Lightbulb, Building2, ShieldCheck } from 'lucide-react';

export function App() {
  const tramites = [
    {
      titulo: 'Agua y Alcantarillado',
      descripcion: 'Reporte de fugas de agua, cortes en el suministro y mantenimiento de alcantarillado.',
      categoria: 'Servicios Básicos',
      icono: <Droplets size={24} />
    },
    {
      titulo: 'Recolección de Basura',
      descripcion: 'Consulta de horarios de rutas, reporte de acumulación de desechos y puntos críticos.',
      categoria: 'Servicios Urbanos',
      icono: <Trash2 size={24} />
    },
    {
      titulo: 'Alumbrado Público',
      descripcion: 'Reporte de lámparas apagadas, fallas en la luminaria y postes caídos o dañados.',
      categoria: 'Infraestructura',
      icono: <Lightbulb size={24} />
    }
  ];

  return (
    <>
      {/* Top Banner Informativo */}
      <div className="top-bar">
        <div className="container top-bar-content">
          <div className="top-bar-tag">
            <ShieldCheck size={16} />
            <span>Portal Oficial de Atención Ciudadana</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Línea Gratuita: 0800-1234</span>
          </div>
        </div>
      </div>

      {/* Encabezado Institucional */}
      <header className="header-institucional">
        <div className="container header-content">
          <div className="escudo-brand">
            <div className="logo-escudo">
              <Building2 size={28} />
            </div>
            <div>
              <h1 className="titulo-institucional-header">Portal Institucional de Trámites y Servicios</h1>
              <p className="subtitulo-header">Atención y soluciones rápidas para la comunidad</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Institucional Banner */}
      <section className="hero-institucional">
        <div className="container">
          <div className="badge-gobierno">
            <span>Atención Ciudadana 24/7</span>
          </div>
          <h2 className="hero-titulo">Servicios Municipales al Alcance de Todos</h2>
          <p className="hero-bajada">
            Gestiona tus reportes, solicitudes e información de servicios públicos de manera transparente, rápida y eficiente.
          </p>
        </div>
      </section>

      {/* Sección Respuestas con Tarjetas */}
      <main className="seccion-respuestas">
        <div className="container">
          <div className="encabezado-seccion">
            <h2 className="titulo-respuestas">Respuestas</h2>
            <p className="subtitulo-respuestas">
              Selecciona la categoría correspondiente para consultar o realizar tu trámite.
            </p>
          </div>

          <div className="grid-tarjetas">
            {tramites.map((item, index) => (
              <TarjetaTramite
                key={index}
                titulo={item.titulo}
                descripcion={item.descripcion}
                categoria={item.categoria}
                icono={item.icono}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer Institucional */}
      <footer className="footer-institucional">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              Portal Institucional de Servicios Públicos
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
              <span>Central de Emergencias: 105</span>
              <span>Contacto: contacto@gobierno.gob</span>
            </div>
          </div>
          <div className="footer-copy">
            © 2026 Gobierno Institucional • Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
