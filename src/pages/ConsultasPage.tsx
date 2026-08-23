import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  RefreshCw, 
  AlertCircle, 
  FileText, 
  CheckCircle, 
  Clock, 
  Calendar, 
  User, 
  Droplets, 
  Trash2, 
  Lightbulb, 
  Tag,
  HelpCircle,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export interface PQRSItem {
  id: string;
  solicitante: string;
  categoria: string;
  descripcion: string;
  estado: 'En trámite' | 'Resuelto' | string;
  fechaRadicacion: string;
  plazoLegal: string;
  respuestaOficial: string;
}

export interface ConsultasPageProps {
  onSeleccionarRadicado?: (id: string) => void;
}

export const ConsultasPage: React.FC<ConsultasPageProps> = ({ onSeleccionarRadicado }) => {
  const [items, setItems] = useState<PQRSItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategoria, setFilterCategoria] = useState<string>('todas');
  const [filterEstado, setFilterEstado] = useState<string>('todos');

  const fetchPQRS = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/pqrs');
      if (!response.ok) {
        throw new Error(`Error en el servidor: código ${response.status}`);
      }
      const data: PQRSItem[] = await response.json();
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'No se pudo establecer conexión con el servicio de trámites.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPQRS();
  }, []);

  const getCategoryIcon = (categoria: string) => {
    switch (categoria.toLowerCase()) {
      case 'agua y alcantarillado':
        return <Droplets size={16} color="#0284c7" />;
      case 'recolección de basura':
        return <Trash2 size={16} color="#16a34a" />;
      case 'alumbrado público':
        return <Lightbulb size={16} color="#eab308" />;
      default:
        return <Tag size={16} color="#6366f1" />;
    }
  };

  // Filtrado en tiempo real
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = 
        item.id.toLowerCase().includes(term) ||
        item.solicitante.toLowerCase().includes(term) ||
        item.descripcion.toLowerCase().includes(term) ||
        item.categoria.toLowerCase().includes(term);

      const matchesCategoria = 
        filterCategoria === 'todas' || item.categoria === filterCategoria;

      const matchesEstado = 
        filterEstado === 'todos' || item.estado === filterEstado;

      return matchesSearch && matchesCategoria && matchesEstado;
    });
  }, [items, searchTerm, filterCategoria, filterEstado]);

  return (
    <div className="consultas-container">
      {/* Encabezado de la página de consultas */}
      <div className="consultas-header">
        <h1 className="consultas-titulo">Consulta de Trámites y Radicados (PQRS)</h1>
        <p className="consultas-subtitulo">
          Verifica en tiempo real el estado de atención, tiempos de respuesta y resoluciones oficiales. Haz clic en cualquier radicado para ver su ficha técnica completa.
        </p>
      </div>

      {/* 1. ESTADO DE CARGA (Loading) */}
      {loading && (
        <div className="estado-caja estado-cargando">
          <div className="spinner-institucional"></div>
          <h3 className="estado-titulo">Cargando trámites y radicados...</h3>
          <p className="estado-desc">Estamos consultando la base de datos oficial del portal.</p>
        </div>
      )}

      {/* 2. ESTADO DE ERROR */}
      {!loading && error && (
        <div className="estado-caja estado-error">
          <div className="icono-alerta">
            <AlertCircle size={44} color="#dc2626" />
          </div>
          <h3 className="estado-titulo" style={{ color: '#dc2626' }}>
            Error al consultar los trámites
          </h3>
          <p className="estado-desc">{error}</p>
          <button onClick={fetchPQRS} className="btn-reintentar" type="button">
            <RefreshCw size={18} />
            <span>Reintentar conexión</span>
          </button>
        </div>
      )}

      {/* Si no hay error ni está cargando, mostramos los controles y resultados */}
      {!loading && !error && (
        <>
          {/* Barra de Filtros y Búsqueda en Tiempo Real */}
          <div className="panel-busqueda">
            <div className="input-busqueda-wrapper">
              <Search className="icono-busqueda" size={20} />
              <input
                type="text"
                className="input-busqueda"
                placeholder="Buscar por radicado (ej: RAD-2026-001), solicitante o palabra clave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="btn-limpiar" 
                  onClick={() => setSearchTerm('')}
                  title="Limpiar búsqueda"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="filtros-wrapper">
              <select 
                className="select-filtro"
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
              >
                <option value="todas">Todas las categorías</option>
                <option value="Agua y Alcantarillado">Agua y Alcantarillado</option>
                <option value="Recolección de Basura">Recolección de Basura</option>
                <option value="Alumbrado Público">Alumbrado Público</option>
              </select>

              <select 
                className="select-filtro"
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="Resuelto">Resuelto</option>
                <option value="En trámite">En trámite</option>
              </select>

              <button 
                onClick={fetchPQRS} 
                className="btn-actualizar" 
                title="Actualizar datos"
                type="button"
              >
                <RefreshCw size={16} />
                <span>Actualizar</span>
              </button>
            </div>
          </div>

          {/* 3. ESTADO VACÍO (Empty) */}
          {filteredItems.length === 0 ? (
            <div className="estado-caja estado-vacio">
              <div className="icono-vacio">
                <HelpCircle size={44} color="#64748b" />
              </div>
              <h3 className="estado-titulo">No se encontraron trámites</h3>
              <p className="estado-desc">
                No hay resultados que coincidan con los criterios de búsqueda o filtros seleccionados.
              </p>
              {(searchTerm || filterCategoria !== 'todas' || filterEstado !== 'todos') && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategoria('todas');
                    setFilterEstado('todos');
                  }} 
                  className="btn-reintentar"
                  type="button"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          ) : (
            /* 4. ESTADO LISTA CON DATOS */
            <div className="lista-pqrs-grid">
              {filteredItems.map((item) => {
                const esResuelto = item.estado.toLowerCase() === 'resuelto';
                return (
                  <article key={item.id} className="tarjeta-pqrs">
                    {/* Header de la tarjeta */}
                    <div className="tarjeta-pqrs-header">
                      <button 
                        className="radicado-badge radicado-badge-clickable"
                        onClick={() => onSeleccionarRadicado?.(item.id)}
                        title={`Ver ficha técnica de ${item.id}`}
                        type="button"
                      >
                        <FileText size={15} />
                        <span>{item.id}</span>
                      </button>

                      {/* Etiqueta de estado en color */}
                      <div className={`badge-estado ${esResuelto ? 'estado-resuelto' : 'estado-tramite'}`}>
                        {esResuelto ? <CheckCircle size={15} /> : <Clock size={15} />}
                        <span>{item.estado}</span>
                      </div>
                    </div>

                    {/* Categoría y Solicitante */}
                    <div className="tarjeta-pqrs-meta">
                      <span className="categoria-tag">
                        {getCategoryIcon(item.categoria)}
                        <span>{item.categoria}</span>
                      </span>

                      <span className="solicitante-tag">
                        <User size={15} color="#475569" />
                        <span>{item.solicitante}</span>
                      </span>
                    </div>

                    {/* Descripción de la solicitud */}
                    <p className="tarjeta-pqrs-desc">
                      {item.descripcion}
                    </p>

                    {/* Fechas de radicación y plazo */}
                    <div className="fechas-grid">
                      <div className="fecha-item">
                        <Calendar size={14} />
                        <span><strong>Radicado:</strong> {item.fechaRadicacion}</span>
                      </div>
                      <div className="fecha-item">
                        <Clock size={14} />
                        <span><strong>Plazo legal:</strong> {item.plazoLegal}</span>
                      </div>
                    </div>

                    {/* Respuesta Oficial */}
                    <div className="respuesta-oficial-box">
                      <div className="respuesta-oficial-header">
                        <MessageSquare size={15} />
                        <span>Respuesta Oficial:</span>
                      </div>
                      <p className="respuesta-oficial-texto">
                        {item.respuestaOficial}
                      </p>
                    </div>

                    {/* Botón para ver Ficha Técnica Completa */}
                    <div className="tarjeta-pqrs-footer">
                      <button 
                        className="btn-ver-ficha"
                        onClick={() => onSeleccionarRadicado?.(item.id)}
                        type="button"
                      >
                        <span>Ver Ficha Técnica Completa</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ConsultasPage;
