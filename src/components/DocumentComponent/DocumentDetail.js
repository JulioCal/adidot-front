/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react"; //eslint-disable-line
import Button from "react-bootstrap/Button";
import Comments from "../CommentsComponent/Comments";
import DocsContext from "../../Contexts/DocumentContext";
import CredentialContext from "../../Contexts/CredentialContext";
import { IoReturnUpBack } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLocation } from "wouter";
import {ScaleLoader} from "react-spinners"
import fileDownload from 'js-file-download'
import axios from "axios";
import "./Document.css";

export default function DetailedDocument(params) {
  const API_URL = "http://localhost:8000/api/";
  const { data } = useContext(DocsContext);
  const [downloading, setDownload] = useState(false);
  const [edit, toggleEdit] = useState(false);
  const [location, setLocation] = useLocation();
  const { logData } = useContext(CredentialContext);
  let identification = params.params.id;
  const doc = data.find((documento) => documento.id == identification);

  if (!doc || (doc.permit == "private" && !logData.isLogged)) {
    setLocation("/");
  }
  useEffect(() => {
    if (doc.trabajador_cedula === logData.cedula) {
      toggleEdit(true);
    }
  }, [logData.cedula]);

  const Download = (evt) => {
    evt.preventDefault();
    setDownload(true);
    axios.post(API_URL + "download", doc, {
      responseType: 'blob',
    }).then((response) => {
      const filename = doc.title+'.'+doc.file.split('.').pop();
      fileDownload(response.data, filename)
    }).then((res) => {
      setDownload(false);
    });
  };
  const editFile = (e) => {
    e.preventDefault();
    setLocation(location + "/edit", doc);
  };

  return (
    <>
      <div className="Noticia-detalle">
        <div className="Header-noticia">
          <span className="Fa-edit" onClick={() => window.history.go(-1)}>
            <IoReturnUpBack></IoReturnUpBack>
          </span>
          <h2 className="Titulo">{doc.title ? doc.title : null}</h2>
          <span className="Date">{doc.Date ? doc.Date : null}</span>
          {edit ? (
              <>
            <span className="Fa-edit" onClick={editFile}>
              <FaEdit></FaEdit>
            </span>
            <span className="Fa-edit" onClick={() => { console.log('que pasa'); } }>
                <FaTrash></FaTrash>
              </span>
              </>
          ) : null}
        </div>
        <div className="Body-noticia">
          <img
            src={doc.img ? doc.img : null}
            onError={(e) => (e.target.style.display = "none")}
            alt=""
          />
          <p className="Informacion">{doc.text ? doc.text : "No such File"}</p>
        </div>
        <div className="Footer-noticia">
          {doc.file ? 
            <Button
              className="Download-button"
              variant="success"
              disabled={downloading}
              onClick={Download}
            >
              {downloading ? <ScaleLoader className="loader" height={20} color={"#FFF"} /> : 'Descarga'}
            </Button>
           : null}
          <span className="Footer-content">
            documento: {doc.id ? doc.id : ""}
          </span>
          <span className="Footer-content">
            autor: {doc.owner ? doc.owner : ""}
          </span>
        </div>
        <Comments params={doc}></Comments>
      </div>
    </>
  );
}

