/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Form,
  Row,
  Col,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { ScaleLoader } from "react-spinners";
import { IoReturnUpBack } from "react-icons/io5";
import Constants from "../Constants";
import "./Document.css";
import axios from "axios";
import CredentialContext from "../../Contexts/CredentialContext";

export default function NewDocument() {
  let current = new Date();
  const [location, setLocation] = useLocation();
  const { logData } = useContext(CredentialContext);
  const API_URL = "http://localhost:8000/api/";
  const [group, setGroup] = useState(Constants());
  const [showGroup, setShowGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, variant: "", message: "" });
  const {
    register,
    onChange,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (!logData.isLogged) {
      setLocation("/");
    }
    let headers = setHeaders();
    axios
      .get(API_URL + "group", {
        headers,
        params: { owner: logData.cedula },
      })
      .then((Response) => {
        console.log(Response.data);
        setGroup([...Constants(), ...Response.data]);
      })
      .catch((err) => {
        Toaster("danger", "Hubo un error inesperado recuperando los grupos.");
      });
  }, [location]);

  function Toaster(variant, message) {
    setToast({ show: true, variant: variant, message: message });
  }

  const setHeaders = () => {
    let token = window.sessionStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    return headers;
  };

  const createDocument = (datax, e) => {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();
    formData.append("file", datax.file[0]);
    formData.append("owner", datax.owner);
    formData.append("title", datax.title);
    formData.append("trabajador_cedula", datax.trabajador_cedula);
    formData.append("text", datax.text);
    formData.append("permit", datax.permit);
    formData.append("grupos", JSON.stringify(datax.grupos));
    axios({
      headers: { "Content-Type": "multipart/form-data; charset=utf-8;" },
      method: "post",
      url: API_URL + "document",
      data: formData,
    })
      .then((response) => {
        Toaster("success", response.data.message);
        reset();
        setLoading(false);
      })
      .catch((error) => {
        Toaster("danger", error.message);
        setLoading(false);
      });
  };
  const showGroupInput = (option) => {
    if (option === "3") {
      setShowGroup(true);
    } else {
      setShowGroup(false);
    }
  };

  return (
    <>
      <div className="Noticia-detalle Form">
        <Form onSubmit={handleSubmit(createDocument)}>
          <Form.Control
            type="hidden"
            value={logData.login}
            {...register("owner")}
          />
          <Form.Control
            type="hidden"
            value={logData.cedula}
            {...register("trabajador_cedula")}
          />
          <Row className="Header-noticia">
            <Col>
              <Form.Group controlId="Name">
                <Stack direction="horizontal">
                  <span
                    className="Fa-edit"
                    onClick={() => window.history.go(-1)}
                  >
                    <IoReturnUpBack></IoReturnUpBack>
                  </span>
                  <Form.Label>
                    <h4 className="h4 mt-2">Titulo : </h4>
                  </Form.Label>
                  <Form.Control
                    className="titulo"
                    type="text"
                    maxLength="34"
                    size="sm"
                    {...register("title", { required: true })}
                  />
                </Stack>
              </Form.Group>
            </Col>
            <Col>
              <p class="stroke">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 72">
                  <text x="650" y="60">
                    {current.getDate() + "/" + (current.getMonth() + 1)}
                  </text>
                </svg>
              </p>
            </Col>
          </Row>
          <Row className="Textborders">
            <Col>
              <Form.Group controlId="Description">
                <Form.Control
                  as="textarea"
                  className="Informacion"
                  rows={12}
                  placeholder="Descripcion..."
                  {...register("text")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="Footer-noticia">
            <Col className="Col-text">
              <Form.Group controlId="formFileSm" className="mb-2">
                <Form.Label>Adjuntar Archivo</Form.Label>
                <Form.Control type="file" size="sm" {...register("file")} />
              </Form.Group>
            </Col>
            <Col className="Col-text">
              <Form.Label>Visibilidad del post</Form.Label>
              <Form.Control
                as="select"
                size="sm"
                className="mb-2"
                {...register("permit", {
                  onChange: (e) => showGroupInput(e.target.value),
                })}
              >
                <option value="1">publico</option>
                <option value="2">privado</option>
                <option value="3">limitado</option>
              </Form.Control>
              {showGroup ? (
                <>
                  <Form.Label>grupo</Form.Label>
                  <Form.Select {...register("grupos")}>
                    {
                      //poner aqui el beautiful dnd para seleccion multiple de grupos.
                      group.map((groupUnit) => (
                        <option>{groupUnit.nombre}</option>
                      ))
                    }
                  </Form.Select>
                </>
              ) : null}
            </Col>
            <Col className="Footer-content-end">
              <Stack direction="horizontal">
                {loading ? (
                  <ScaleLoader
                    className="loader mt-3"
                    height={20}
                    color={"#FFF"}
                  />
                ) : (
                  <Button
                    variant="success"
                    className="mt-3 "
                    size="md"
                    block="block"
                    type="submit"
                  >
                    Publicar
                  </Button>
                )}
              </Stack>
            </Col>
          </Row>
        </Form>
      </div>

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ show: false, variant: "", message: "" })}
          show={toast.show}
          delay={4000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Adidot</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
