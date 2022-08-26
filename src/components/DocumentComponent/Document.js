import React from "react"; //eslint-disable-line
import "./Document.css";
import { useLocation } from "wouter";

export default function Document({ id, title, img, text, owner, date }) {
  // eslint-disable-next-line no-unused-vars
  const [location, pushLocation] = useLocation();
  const documentDetail = (evt) => {
    //evita que la pagina se recargue al usar rutas.
    evt.preventDefault();
    //implementa la ruta especificada
    pushLocation(`/documents/${id}`);
  };

  return (
    <div className="Noticia" onClick={documentDetail}>
      <div className="Header-noticia">
        <h3 className="Titulo">
          {title.length > 28 ? title.slice(0, 24) + ". . ." : title}
        </h3>
      </div>
      <div className="Body-noticia">
        <p className="Informacion">
          {text ? text : "Este documento no contiene texto adjunto"}
        </p>
      </div>
      <div className="Footer-noticia">
        <span className="Footer-content">documento: {id} </span>
        <span className="Footer-content">autor: {owner}</span>
      </div>
    </div>
  );
}
