import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Copy, 
  Check, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar,
  User, 
  Building2,
  ShieldCheck,
  AlertCircle, 
  Printer, 
  MessageSquare,
  Tag,
  Droplets,
  Trash2,
  Lightbulb
} from 'lucide-react';
import type { PQRSItem } from './ConsultasPage';

export interface DetalleConsultaPageProps {
  id?: string;
  onVolver?: () => void;
}

export const DetalleConsultaPage: React.FC<DetalleConsultaPageProps> = ({ 
  id = '1', 
  onVolver 
}) => {
  const [item, setItem] = useState<PQRSItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<boolean>(false);

  useEffect(() => {
    const cargarDetalle = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/pqrs');
        if (!res.ok) {
          throw new Error('No se pudo obtener la información de trámites del servidor.');
        }
        const data: PQRSItem[] = await res.json();
        
        // Buscar por id exacto, por número de radicado o por índice (ej: /consultas/1 -> RAD-2026-001 o índice 0)
        const encontrado = data.find((d, idx) => {
          const cleanId = id.trim().toLowerCase();
          const itemNum = (idx + 1).toString();
          return (
            d.id.toLowerCase() === cleanId ||
            d.id.toLowerCase().replace(/[^0-9]/g, '') === cleanId.replace(/[^0-9]/g, '') ||
            cleanId === itemNum ||
            d.id.endsWith(`-${cleanId.padStart(3, '0')}`)
          );
        });

        if (encontrado) {
          setItem(encontrado);
        } else {
          setError(`No se encontró ningún trámite con el identificador o radicado "${id}".`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al consultar el trámite.');
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [id]);

  const handleCopiarEnlace = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    });
  };

  const handleImprimir = () => {
    window.print();
  };

  const getCategoryIcon = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'agua y alcantarillado':
        return <Droplets size={20} color="#0284c7" />;
      case 'recolección de basura':
        return <Trash2 size={20} color="#16a34a" />;
      case 'alumbrado público':
        return <Lightbulb size={20} color="#eab308" />;
      default:
        return <Tag size={20} color="#6366f1" />;
    }
  };

  if (loading) {
    return (
      <div className="consultas-container">
        <div className="estado-caja estado-cargando">
          <div className="spinner-institucional"></div>
          <h3 className="estado-titulo">Cargando ficha técnica del trámite...</h3>
          <p className="estado-desc">Obteniendo los registros oficiales de radicación.</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="consultas-container">
        <div className="estado-caja estado-error">
          <div className="icono-alerta">
            <AlertCircle size={48} color="#dc2626" />
          </div>
          <h3 className="estado-titulo" style={{ color: '#dc2626' }}>
            Trámite No Encontrado
          </h3>
          <p className="estado-desc">{error || 'El radicado solicitado no existe en la base de datos.'}</p>
          <button onClick={onVolver} className="btn-reintentar" type="button">
            <ArrowLeft size={18} />
            <span>Volver a Consultas</span>
          </button>
        </div>
      </div>
    );
  }

  const esResuelto = item.estado.toLowerCase() === 'resuelto';

  return (
    <div className="consultas-container ficha-tecnica-wrapper">
      {/* Barra superior de navegación y acciones */}
      <div className="acciones-ficha-top">
        <button 
          onClick={onVolver} 
          className="btn-volver-consultas" 
          type="button"
          aria-label="Volver a la lista de consultas"
        >
          <ArrowLeft size={18} />
          <span>Volver a Consultas</span>
        </button>

        <div className="grupo-botones-accion">
          <button 
            onClick={handleCopiarEnlace} 
            className={`btn-copiar-enlace ${copiado ? 'btn-copiado' : ''}`}
            type="button"
            title="Copiar enlace directo a esta ficha técnica"
          >
            {copiado ? <Check size={18} /> : <Copy size={18} />}
            <span>{copiado ? '¡Enlace Copiado!' : 'Copiar Enlace'}</span>
          </button>

          <button 
            onClick={handleImprimir} 
            className="btn-imprimir"
            type="button"
            title="Imprimir ficha técnica"
          >
            <Printer size={18} />
            <span>Imprimir Ficha</span>
          </button>
        </div>
      </div>

      {/* Tarjeta / Ficha Técnica Principal */}
      <article className="ficha-tecnica-card">
        {/* Encabezado de la Ficha Técnica */}
        <div className="ficha-header">
          <div className="ficha-header-left">
            <div className="ficha-radicado-chip">
              <FileText size={18} />
              <span>RADICADO: {item.id}</span>
            </div>
            <h1 className="ficha-titulo-principal">
              Ficha Técnica de Trámite Ciudadano
            </h1>
            <p className="ficha-subtitulo">
              Expediente digital oficial del Sistema de Atención de Servicios Municipales.
            </p>
          </div>

          <div className="ficha-header-right">
            <div className={`badge-estado-grande ${esResuelto ? 'estado-resuelto' : 'estado-tramite'}`}>
              {esResuelto ? <CheckCircle2 size={20} /> : <Clock size={20} />}
              <span>ESTADO: {item.estado.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Cuadrícula de Información General */}
        <div className="ficha-seccion-grid">
          {/* Bloque 1: Solicitante */}
          <div className="ficha-bloque">
            <div className="ficha-bloque-header">
              <User size={18} color="#003399" />
              <h4>Datos del Solicitante</h4>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Ciudadano(a):</span>
              <strong className="campo-valor">{item.solicitante}</strong>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Tipo de Solicitud:</span>
              <span className="campo-valor">Petición de Interés General (PQRS)</span>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Canal de Radicación:</span>
              <span className="campo-valor">Ventanilla Única Digital</span>
            </div>
          </div>

          {/* Bloque 2: Categoría y Dependencia */}
          <div className="ficha-bloque">
            <div className="ficha-bloque-header">
              {getCategoryIcon(item.categoria)}
              <h4>Clasificación del Trámite</h4>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Categoría del Servicio:</span>
              <strong className="campo-valor">{item.categoria}</strong>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Dependencia Responsable:</span>
              <span className="campo-valor">Secretaría de Servicios Públicos e Infraestructura</span>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Prioridad de Atención:</span>
              <span className="campo-valor-prioridad">Alta (Servicio Esencial)</span>
            </div>
          </div>

          {/* Bloque 3: Tiempos y Fechas Legales */}
          <div className="ficha-bloque">
            <div className="ficha-bloque-header">
              <Calendar size={18} color="#003399" />
              <h4>Plazos y Tiempos Legales</h4>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Fecha de Radicación:</span>
              <strong className="campo-valor">{item.fechaRadicacion}</strong>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Plazo Legal de Respuesta:</span>
              <strong className="campo-valor" style={{ color: '#b45309' }}>
                {item.plazoLegal} (15 días hábiles)
              </strong>
            </div>
            <div className="ficha-campo">
              <span className="campo-etiqueta">Cumplimiento Legal:</span>
              <span className="campo-valor" style={{ color: esResuelto ? '#15803d' : '#b45309', fontWeight: 600 }}>
                {esResuelto ? '✓ Resuelto dentro del término legal' : '⏳ En término legal de atención'}
              </span>
            </div>
          </div>
        </div>

        {/* Sección: Descripción de la Solicitud */}
        <div className="ficha-caja-descripcion">
          <h4 className="caja-subtitulo">
            <FileText size={18} color="#003399" />
            <span>Descripción Detallada de la Solicitud</span>
          </h4>
          <p className="caja-texto-descripcion">
            {item.descripcion}
          </p>
        </div>

        {/* Sección: Respuesta Oficial de la Entidad */}
        <div className={`ficha-caja-resolucion ${esResuelto ? 'resolucion-resuelta' : 'resolucion-tramite'}`}>
          <div className="resolucion-header">
            <MessageSquare size={20} />
            <h4>Pronunciamiento y Respuesta Oficial de la Entidad</h4>
          </div>
          <p className="resolucion-texto">
            {item.respuestaOficial}
          </p>
          <div className="resolucion-meta">
            <ShieldCheck size={16} />
            <span>Respuesta validada y certificada digitalmente por la entidad municipal.</span>
          </div>
        </div>

        {/* Footer de la Ficha Técnica */}
        <div className="ficha-footer">
          <div className="ficha-footer-info">
            <Building2 size={16} color="#64748b" />
            <span>Alcaldía Municipal • Sistema Integrado de Gestión Documental y PQRS</span>
          </div>
          <div className="ficha-footer-acciones">
            <button onClick={onVolver} className="btn-volver-secundario" type="button">
              ← Volver a Consultas
            </button>
            <button onClick={handleCopiarEnlace} className="btn-copiar-secundario" type="button">
              {copiado ? '✓ Enlace Copiado' : '🔗 Copiar Enlace Directo'}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default DetalleConsultaPage;
