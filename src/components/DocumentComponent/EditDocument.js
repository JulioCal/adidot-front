/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect, useMemo } from "react";
import CredentialContext from "../../Contexts/CredentialContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import { IoReturnUpBack } from "react-icons/io5";
import { useLocation } from "wouter";
import Constants from "../Helpers/Constants";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./Document.css";

export default function EditDocument(params) {
  //constantes de contexto y data de otros componentes.
  const { data } = useContext(DocsContext);
  const API_URL = "http://localhost:8000/api/";
  const { logData, setLog } = useContext(CredentialContext);

  let current = new Date();
  let identification = params.params.id;
  const doc = data.find((documento) => documento.document_id == identification);
  const [selectedOption, setOption] = useState(1);
  const [location, setLocation] = useLocation();
  const [group, setGroup] = useState({
    id: uuidv4(),
    nombre: "Grupos disponibles",
    items: Constants(),
  });
  const [selectedGroup, setSelectedGroup] = useState({
    id: uuidv4(),
    items: [],
    nombre: "Grupos seleccionados",
  });

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
  let helperArray = useMemo(() => {
    let hA = group.items;
    if (selectedGroup.items.length > 0) {
      for (let i = 0; i < selectedGroup.items.length; i++) {
        for (let j = 0; j < hA.length; j++) {
          if (selectedGroup.items[i].id === hA[j].id) {
            hA.splice(j, 1);
          }
        }
      }
    }
    return hA;
  }, [selectedGroup, group]);

  useEffect(() => {
    console.log(doc);
    if (!logData.isLogged || doc === undefined) {
      setLocation("/");
    }
    if (doc.permit === "private") {
      setOption(2);
    } else if (doc.permit === "limited") {
      showGroupInput("3");
      setOption(3);
    }
    let headers = setHeaders();
    axios
      .get(API_URL + "group", {
        headers,
        params: { owner: logData.cedula },
      })
      .then((Response) => {
        setGroup((group) => ({
          ...group,
          items: [...Constants(), ...Response.data],
        }));
      })
      .catch((err) => {
        Toaster("danger", "Hubo un error inesperado recuperando los grupos.");
      });
    if (doc.grupos === null) {
      doc.grupos = [];
    }
    setSelectedGroup((group) => ({ ...group, items: doc.grupos }));
    setTimeout(() => {
      reset({
        title: doc.title,
        text: doc.text,
      });
      //setGroup((group) => ({ ...group, items: helperArray }));
    }, 500);
  }, [reset, logData.isLogged]);

  const setHeaders = () => {
    let token = window.sessionStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    return headers;
  };

  const updateDocument = (datax, e) => {
    e.preventDefault();
    setLoading(true);
    let formData = new FormData();
    if (datax.file) {
      formData.append("file", datax.file[0]);
    }
    formData.append("title", datax.title);
    formData.append("text", datax.text);
    formData.append("permit", datax.permit);
    formData.append("_method", "PATCH");
    if (datax.permit === "3") {
      formData.append("grupos", JSON.stringify(selectedGroup.items));
    } else {
      formData.append("grupos", null);
    }
    axios
      .post(API_URL + `document/${doc.document_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data; charset=utf-8;" },
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

  function onDragEnd(result, arrayFrom, sourcArray, arrayTo, destArray) {
    if (!result.destination) return;
    //for array of columns => columnsArray.find((column) => column.id === destination.id)
    const { source, destination } = result;
    if (source.droppableId === group.id) {
      arrayFrom = group.items;
      sourcArray = setGroup;
    } else {
      arrayFrom = selectedGroup.items;
      sourcArray = setSelectedGroup;
    }
    if (destination.droppableId === group.id) {
      arrayTo = group.items;
      destArray = setGroup;
    } else {
      arrayTo = selectedGroup.items;
      destArray = setSelectedGroup;
    }
    if (source.droppableId !== destination.droppableId) {
      const sourcItems = Array.from(arrayFrom);
      const destItems = Array.from(arrayTo);
      const [removedItem] = sourcItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removedItem);
      sourcArray((groupArray) => ({ ...groupArray, items: sourcItems }));
      destArray((selectedGroup) => ({ ...selectedGroup, items: destItems }));
    } else {
      const items = Array.from(arrayFrom);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      sourcArray((groupArray) => ({ ...groupArray, items: items }));
    }
  }

  return (
    <>
      <ToastContainer className="p-3">
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
            </Col>
            <Col className="Footer-content-end">
              <Stack direction="horizontal">
                {loading ? (
                  <ScaleLoader
                    className="loader mt-3"
                    height={20}
                    color={"#f6f6f6"}
                  />
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
            {showGroup ? (
              <Row className="mt-3">
                <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                  <Row>
                    <Col style={{ textAlign: "justify" }}>
                      <h4>{selectedGroup.nombre}</h4>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="dropeable-list">
                        <Droppable droppableId={group.id}>
                          {(provided) => (
                            <ul
                              className="dropeable-container"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {helperArray.map(({ id, nombre }, index) => {
                                return (
                                  <Draggable
                                    key={id.toString()}
                                    draggableId={nombre}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <li
                                        className="dropeable-list-item"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        {nombre}
                                      </li>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </div>
                    </Col>
                    <Col>
                      <div className="dropeable-list">
                        <Droppable droppableId={selectedGroup.id}>
                          {(provided) => (
                            <ul
                              className="dropeable-container"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {selectedGroup.items.map(
                                ({ id, nombre }, index) => {
                                  return (
                                    <Draggable
                                      key={id.toString()}
                                      draggableId={nombre}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <li
                                          className="dropeable-list-item"
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          {nombre}
                                        </li>
                                      )}
                                    </Draggable>
                                  );
                                }
                              )}
                              {provided.placeholder}
                            </ul>
                          )}
                        </Droppable>
                      </div>
                    </Col>
                  </Row>
                </DragDropContext>
              </Row>
            ) : null}
          </Row>
        </Form>
      </div>
    </>
  );
}
