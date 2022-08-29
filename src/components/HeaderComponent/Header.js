/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import "./Header.css";
import logo from "../../images/corpozulia.png";
import gbdv from "../../images/GBDV.png";
import { useLocation } from "wouter";
import { Button, Nav } from "react-bootstrap";
import CredentialContext from "../../Contexts/CredentialContext";

export default function Header() {
  let API_URL = `http://localhost:8000/api`;
  //Header principal y barra de navegacion.
  // eslint-disable-next-line no-unused-vars
  const [path, pushLocation] = useLocation();
  const { logData, setLog } = useContext(CredentialContext);

  useEffect(() => {
    if (window.sessionStorage.getItem("user") != null) {
      const user = JSON.parse(window.sessionStorage.getItem("user"));
      setLog((logData) => ({
        ...logData,
        login: user.nombre,
        role: user.role,
        gerencia: user.gerencia,
        cedula: user.cedula,
        isLogged: true,
      }));
    }
  }, []);

  const GoToLocation = (evt) => {
    evt.preventDefault();
    switch (evt.target.name) {
      default:
        return "";
      case "/new-document":
        pushLocation("/new-document");
        break;
      case "/document-list":
        pushLocation("/document-list");
        break; // get documents specific to user.
      case "/groups":
        pushLocation("/groups");
        break; // get/manage groups
      case "/personal-data":
        pushLocation("/personal-data");
        break;
      case "/":
        pushLocation("/");
        break;
    }
  };

  return (
    <>
      <div className="Header">
        <img className="Header-content" src={logo} alt="" />
        <img
          className="Header-content"
          style={{ padding: "1.5rem 0px" }}
          src={gbdv}
          alt=""
        />
        <span className="App-title">
          Corporacion de Desarrollo de la Region Zuliana
        </span>
        <span className="App-title" style={{ border: "none" }}>
          adidot
        </span>
      </div>

      {logData.isLogged ? ( //condicional para mostrar/ocultar elementos segun un estado.
        <Nav expand="md" justify>
          <Nav.Link onClick={GoToLocation} name="/" className="Header-route">
            Home
          </Nav.Link>
          <Nav.Link
            onClick={GoToLocation}
            name="/new-document"
            className="Header-route"
          >
            Nuevo documento
          </Nav.Link>
          <Nav.Link
            onClick={GoToLocation}
            name="/document-list"
            className="Header-route"
          >
            Mis Documentos
          </Nav.Link>
          <Nav.Link
            onClick={GoToLocation}
            name="/groups"
            className="Header-route"
          >
            Manejar Grupos
          </Nav.Link>
          <Nav.Link
            onClick={GoToLocation}
            name="/personal-data"
            className="Header-route"
          >
            Datos personales
          </Nav.Link>
        </Nav>
      ) : null}
    </>
  );
}
