import React from 'react';

export interface TarjetaTramiteProps {
  titulo?: string;
  descripcion?: string;
  categoria?: string;
  Titulo?: string;
  Descripcion?: string;
  Categoria?: string;
  icono?: React.ReactNode;
  onAccion?: () => void;
}

export const TarjetaTramite: React.FC<TarjetaTramiteProps> = (props) => {
  const titulo = props.titulo || props.Titulo || '';
  const descripcion = props.descripcion || props.Descripcion || '';
  const categoria = props.categoria || props.Categoria || '';

  return (
    <article className="tarjeta-tramite">
      <div className="tarjeta-header">
        <span className="tarjeta-categoria">{categoria}</span>
        {props.icono && <div className="tarjeta-icono">{props.icono}</div>}
      </div>
      <h3 className="tarjeta-titulo">{titulo}</h3>
      <p className="tarjeta-descripcion">{descripcion}</p>
      <div className="tarjeta-footer">
        <button 
          className="btn-tramite" 
          onClick={props.onAccion}
          type="button"
        >
          Ver reporte / Solicitud →
        </button>
      </div>
    </article>
  );
};

export default TarjetaTramite;
