/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import CredentialContext from "../../Contexts/CredentialContext";
import {
  Button,
  Form,
  Row,
  Col,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import DocsContext from "../../Contexts/DocumentContext";
import { ScaleLoader } from "react-spinners";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import axios from "axios";
import "./Document.css";

export default function EditDocument(params) {
  //constantes de contexto y data de otros componentes.
  const { data } = useContext(DocsContext);
  const { logData, setLog } = useContext(CredentialContext);
  const [group, setGroup] = useState([]); //get lista de grupos

  let current = new Date();
  let identification = params.params.id;
  const doc = data.find((documento) => documento.id == identification);
  const [selectedOption, setOption] = useState(1);
  const [location, setLocation] = useLocation();
  const [file, setFile] = useState(null);

  //constantes de visualizacion, formularios y alertas.
  const [showGroup, setShowGroup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, variant: "", message: "" });
  const {
    register,
    onChange,
    handleSubmit,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (!logData.isLogged || doc === undefined) {
      setLocation("/");
    }
    if (doc.permit === "private") {
      setOption(2);
    } else if (doc.permit === "limited") {
      setOption(3);
    }
    setTimeout(() => {
      reset({
        title: doc.title,
        text: doc.text,
      });
    }, 500);
  }, [reset]);

  const updateDocument = (datax, e) => {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();
    formData.append("file", datax.file[0]);
    formData.append("owner", datax.owner);
    formData.append("title", datax.title);
    formData.append("trabajador_cedula", datax.trabajador_cedula);
    formData.append("text", datax.text);
    formData.append("permit", datax.permit);
    formData.append("group", datax.group);
      axios({
        headers: { "Content-Type": "multipart/form-data; charset=utf-8;" },
        method: "patch",
        url: `http://localhost:8000/api/document/${doc.id}`,
        data: formData,
      })
      .then((response) => {
        Toaster("success", response.data.message);
        setLoading(false);
      })
      .catch((error) => {
        Toaster("danger", error.message);
        setLoading(false);
      });
  };

  function Toaster(variant, message) {
    setToast({ show: true, variant: variant, message: message });
  }

  const showGroupInput = (option) => {
    setOption(option);
    if (option === "3") {
      setShowGroup(true);
    } else {
      setShowGroup(false);
    }
  };

  return (
    <>
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
      <div className="Noticia-detalle Form">
        <Form onSubmit={handleSubmit(updateDocument)}>
          <Row className="Header-noticia">
            <Col>
              <Form.Group controlId="Name">
                <Stack direction="horizontal">
                  <Form.Label>
                    <h4 className="h4 mt-2">Titulo : </h4>
                  </Form.Label>
                  <Form.Control
                    className="titulo"
                    type="text"
                    size="sm"
                    {...register("title")}
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
                  {...register("text")}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="Footer-noticia">
            <Col className="Col-text">
              <Form.Group controlId="formFileSm" className="mb-2">
                <Form.Label>Adjuntar Archivo</Form.Label>
                <Form.Control type="file" size="sm" />
              </Form.Group>
            </Col>
            <Col className="Col-text">
              <Form.Label>Visibilidad del post</Form.Label>
              <Form.Control
                as="select"
                value={selectedOption}
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
                  <Form.Select {...register("group")}>
                    {group.map((groupUnit) => (
                      <option>{groupUnit}</option>
                    ))}
                  </Form.Select>
                </>
              ) : null}
            </Col>
            <Col className="Footer-content-end">
              <Stack direction="horizontal">
                {loading ? (
                  <ScaleLoader className="loader mt-3" color={"#eee"} />
                ) : (
                  <Button
                    variant="warning"
                    className="mt-3 "
                    size="md"
                    block="block"
                    type="submit"
                  >
                    Actualizar
                  </Button>
                )}
              </Stack>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}
