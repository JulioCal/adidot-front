import React from "react"; //eslint-disable-line
import "./Document.css";
import { useLocation } from "wouter";

export default function Document({ id, title, img, text, owner }) {
  // eslint-disable-next-line no-unused-vars
  const [location, pushLocation] = useLocation();
  const current = new Date(); //this should come from SQL query.

  const documentDetail = (evt) => {
    //evita que la pagina se recargue al usar rutas.
    evt.preventDefault();
    //implementa la ruta especificada
    pushLocation(`/documents/${id}`);
  };

  return (
    <div className="Noticia" onClick={documentDetail}>
      <div className="Header-noticia">
        <h3 className="Titulo">{title}</h3>
        <span className="Date">
          {current.getDate() + "/" + (current.getMonth() + 1)}
        </span>
      </div>
      <div className="Body-noticia">
        <img
          src={img}
          onError={(e) => (e.target.style.display = "none")}
          alt=""
        />
        <p className="Informacion">{text}</p>
      </div>
      <div className="Footer-noticia">
        <span className="Footer-content">documento: {id} </span>
        <span className="Footer-content">autor: {owner}</span>
      </div>
    </div>
  );
}
