/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import Comments from "../CommentsComponent/Comments";
import DocsContext from "../../Contexts/DocumentContext";
import CredentialContext from "../../Contexts/CredentialContext";
import { IoReturnUpBack } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useLocation } from "wouter";
import { ScaleLoader } from "react-spinners";
import fileDownload from "js-file-download";
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
  const doc = data.find((documento) => documento.document_id == identification);

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
    axios
      .post(API_URL + "download", doc, {
        responseType: "blob",
      })
      .then((response) => {
        const filename = doc.title + "." + doc.file.split(".").pop();
        fileDownload(response.data, filename);
      })
      .then((res) => {
        setDownload(false);
      });
  };
  const editFile = (e) => {
    e.preventDefault();
    setLocation(location + "/edit", doc);
  };

  const deleteFile = (e) => {
    e.preventDefault();
    let headers = setHeaders();
    axios
      .delete(API_URL + `document/${doc.document_id}`, { headers })
      .then((response) => setLocation("/"));
  };

  const setHeaders = () => {
    if (window.sessionStorage.getItem("token") != null) {
      let token = window.sessionStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };
      return headers;
    }
  };

  return (
    <>
      <div className="Noticia-detalle">
        <div className="Header-noticia">
          <span className="Fa-edit" onClick={() => window.history.go(-1)}>
            <IoReturnUpBack></IoReturnUpBack>
          </span>
          <h2 className="Titulo">{doc.title ? doc.title : ""}</h2>
          <span className="Date">
            <p class="stroke">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 72">
                <text x="650" y="60">
                  {doc.created_at
                    ? new Date(doc.created_at).getDate() +
                      "/" +
                      (new Date(doc.created_at).getMonth() + 1)
                    : ""}
                </text>
              </svg>
            </p>
            {edit ? (
              <>
                <span className="Fa-edit" onClick={editFile}>
                  <FaEdit></FaEdit>
                </span>
                <OverlayTrigger
                  placement="right"
                  overlay={
                    <Tooltip id="button-tooltip-2">click para borrar!</Tooltip>
                  }
                >
                  {({ ref, ...triggerHandler }) => (
                    <span
                      {...triggerHandler}
                      ref={ref}
                      onClick={deleteFile}
                      className="Fa-edit"
                    >
                      <FaTrash></FaTrash>
                    </span>
                  )}
                </OverlayTrigger>
              </>
            ) : null}
          </span>
        </div>
        <div className="Body-noticia">
          <img
            src={doc.img ? doc.img : ""}
            onError={(e) => (e.target.style.display = "none")}
            alt=""
          />
          <p className="Informacion">
            {doc.text ? doc.text : "Esta publicación no tiene texto adjunto."}
          </p>
        </div>
        <div className="Footer-noticia">
          {doc.file ? (
            <Button
              className="Download-button"
              variant="success"
              disabled={downloading}
              onClick={Download}
            >
              {downloading ? (
                <ScaleLoader className="loader" height={20} color={"#f6f6f6"} />
              ) : (
                "Descarga"
              )}
            </Button>
          ) : null}
          <span className="Footer-content">
            documento: {doc.document_id ? doc.document_id : ""}
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
