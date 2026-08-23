import { useState, useEffect } from 'react';
import { TarjetaTramite } from './components/TarjetaTramite';
import { ConsultasPage } from './pages/ConsultasPage';
import { DetalleConsultaPage } from './pages/DetalleConsultaPage';
import { 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Building2, 
  ShieldCheck,
  Home,
  FileSearch
} from 'lucide-react';

export function App() {
  const [vistaActual, setVistaActual] = useState<'inicio' | 'consultas' | 'detalle'>('inicio');
  const [radicadoSeleccionado, setRadicadoSeleccionado] = useState<string>('1');

  // Sincronizar estado con la URL del navegador
  const syncRouteFromPath = () => {
    const pathname = window.location.pathname;
    
    // Ruta: /consultas/:id (ej: /consultas/1 o /consultas/RAD-2026-001)
    const matchDetalle = pathname.match(/^\/consultas\/([^/]+)/);
    if (matchDetalle) {
      setRadicadoSeleccionado(matchDetalle[1]);
      setVistaActual('detalle');
      return;
    }

    // Ruta: /consultas
    if (pathname.startsWith('/consultas')) {
      setVistaActual('consultas');
      return;
    }

    // Ruta por defecto: / (Inicio)
    setVistaActual('inicio');
  };

  useEffect(() => {
    syncRouteFromPath();

    const handlePopState = () => {
      syncRouteFromPath();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navegarA = (vista: 'inicio' | 'consultas' | 'detalle', id?: string) => {
    if (vista === 'inicio') {
      window.history.pushState({}, '', '/');
      setVistaActual('inicio');
    } else if (vista === 'consultas') {
      window.history.pushState({}, '', '/consultas');
      setVistaActual('consultas');
    } else if (vista === 'detalle') {
      const radId = id || '1';
      // Si el id es del formato RAD-2026-001, o número, formatear URL limpia
      const cleanUrlId = radId.startsWith('RAD-2026-') ? radId.replace('RAD-2026-0', '').replace('RAD-2026-', '') : radId;
      window.history.pushState({}, '', `/consultas/${cleanUrlId}`);
      setRadicadoSeleccionado(radId);
      setVistaActual('detalle');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tramites = [
    {
      titulo: 'Agua y Alcantarillado',
      descripcion: 'Reporte de fugas de agua, cortes en el suministro y mantenimiento de alcantarillado.',
      categoria: 'Agua y Alcantarillado',
      icono: <Droplets size={24} />
    },
    {
      titulo: 'Recolección de Basura',
      descripcion: 'Consulta de horarios de rutas, reporte de acumulación de desechos y puntos críticos.',
      categoria: 'Recolección de Basura',
      icono: <Trash2 size={24} />
    },
    {
      titulo: 'Alumbrado Público',
      descripcion: 'Reporte de lámparas apagadas, fallas en la luminaria y postes caídos o dañados.',
      categoria: 'Alumbrado Público',
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

      {/* Encabezado Institucional con Navegación */}
      <header className="header-institucional">
        <div className="container header-content">
          <div className="escudo-brand" onClick={() => navegarA('inicio')} style={{ cursor: 'pointer' }}>
            <div className="logo-escudo">
              <Building2 size={28} />
            </div>
            <div>
              <h1 className="titulo-institucional-header">Portal Institucional de Trámites y Servicios</h1>
              <p className="subtitulo-header">Atención y soluciones rápidas para la comunidad</p>
            </div>
          </div>

          <nav className="nav-menu">
            <button 
              className={`nav-btn ${vistaActual === 'inicio' ? 'active' : ''}`}
              onClick={() => navegarA('inicio')}
              type="button"
            >
              <Home size={17} />
              <span>Inicio</span>
            </button>

            <button 
              className={`nav-btn ${vistaActual === 'consultas' || vistaActual === 'detalle' ? 'active' : ''}`}
              onClick={() => navegarA('consultas')}
              type="button"
            >
              <FileSearch size={17} />
              <span>Consultar Trámites (PQRS)</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Renderizado Condicional de Vistas */}
      {vistaActual === 'inicio' && (
        <>
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
                    onAccion={() => navegarA('consultas')}
                  />
                ))}
              </div>
            </div>
          </main>
        </>
      )}

      {vistaActual === 'consultas' && (
        <ConsultasPage 
          onSeleccionarRadicado={(id) => navegarA('detalle', id)} 
        />
      )}

      {vistaActual === 'detalle' && (
        <DetalleConsultaPage 
          id={radicadoSeleccionado}
          onVolver={() => navegarA('consultas')}
        />
      )}

      {/* Footer Institucional */}
      <footer className="footer-institucional">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              Portal Institucional de Servicios Públicos
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', flexWrap: 'wrap' }}>
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
