/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CredentialContext from "../../Contexts/CredentialContext";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Constants from "../Constants";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";
import { useForm, useWatch } from "react-hook-form";
import axios from "axios";
import "./GroupScreen.css";

export default function GroupScreen() {
  const columnsFromBackend = {
    id: uuidv4(),
    nombre: "Gerencias",
    items: Constants(),
  };

  const ColumnsToBackend = {
    id: uuidv4(),
    nombre: "Nuevo grupo...",
    items: [],
  };

  const URL_API = "http://localhost:8000/api/";
  const [location, setLocation] = useLocation();
  const { logData } = useContext(CredentialContext);
  const [showCreateGroup, setShow] = useState(false);
  const [groupArray, setGroups] = useState({
    items: [],
    nombre: "user groups",
  });
  const [groupConstant, setConstant] = useState(columnsFromBackend);
  const [newArray, setNewArray] = useState(ColumnsToBackend);
  const [allTrabajadores, setTrabajadores] = useState([]);
  let helperArray = useMemo(() => {
    let hA = Constants();
    if (newArray.items.length > 0) {
      for (let i = 0; i < newArray.items.length; i++) {
        for (let j = 0; j < hA.length; j++) {
          if (newArray.items[i].id === hA[j].id) {
            hA.splice(j, 1);
          }
        }
      }
    }
    return hA;
  }, [newArray]);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (!logData.isLogged) {
      setLocation("/");
    }
    let headers = setHeaders();
    axios.get(URL_API + "trabajador", { headers }).then((response) => {
      response.data.splice(0, 1);
      setTrabajadores(response.data);
    });
    //axios.get(URL_API+'groups').then(response => setGroups((groupArray) => ({ ...groupArray, items: response.data })));
  }, [location, logData.isLogged]);

  const handleChange = (e) => {
    e.preventDefault();
    let filtered = [];
    let search = e.target.search.value;
    if (search !== "") {
      filtered = allTrabajadores.filter((str) =>
        str.nombre.replace(/\s/g, "").includes(search)
      );
    }
    if (filtered.length > 0) {
      for (let index = 0; index < filtered.length; index++) {
        filtered[index].id = filtered[index].cedula.toString();
      }
      setConstant((groupArray) => ({
        ...groupArray,
        items: filtered,
      }));
    } else {
      setConstant((groupArray) => ({
        ...groupArray,
        items: helperArray,
      }));
    }
  };

  const setHeaders = () => {
    let token = window.sessionStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    return headers;
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const CreateNewGroup = () => {
    let headers = setHeaders();
    console.log(newArray);
    //axios.post(URL_API+'groups', newArray, {headers}). then(response => console.log(response))
    setNewArray((reset) => ({ ...reset, nombre: "Nuevo grupo...", items: [] }));
    handleClose();
  };

  function onDragEnd(result, arrayFrom, sourcArray, arrayTo, destArray) {
    if (!result.destination) return;
    //for array of columns => columnsArray.find((column) => column.id === destination.id)
    const { source, destination } = result;
    if (source.droppableId === groupConstant.id) {
      arrayFrom = groupConstant.items;
      sourcArray = setConstant;
    } else {
      arrayFrom = newArray.items;
      sourcArray = setNewArray;
    }
    if (destination.droppableId === groupConstant.id) {
      arrayTo = groupConstant.items;
      destArray = setConstant;
    } else {
      arrayTo = newArray.items;
      destArray = setNewArray;
    }
    if (source.droppableId !== destination.droppableId) {
      const sourcItems = Array.from(arrayFrom);
      const destItems = Array.from(arrayTo);
      const [removedItem] = sourcItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removedItem);
      sourcArray((groupArray) => ({ ...groupArray, items: sourcItems }));
      destArray((newArray) => ({ ...newArray, items: destItems }));
    } else {
      const items = Array.from(arrayFrom);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);
      sourcArray((groupArray) => ({ ...groupArray, items: items }));
    }
  }
  return (
    <>
      <div className="Header-noticia m-3 mt-4 mb-0">
        <h3 className="titulo">Grupos personales</h3>
      </div>
      <div className="Body-group m-3 mt-0 mb-0">
        <span className="plus-button" onClick={handleShow}>
          <FaPlus></FaPlus>
        </span>
        <ul className=" ul-dp ">
          {groupArray.items.length > 0
            ? groupArray.items.map(({ nombre }) => (
                <li className="dli">
                  {nombre}
                  <span className="Fa-edit-alt">
                    <FaEdit></FaEdit>
                  </span>
                  <span className="Fa-edit-alt">
                    <FaTrash></FaTrash>
                  </span>
                </li>
              ))
            : "No tienes grupos personales aún..."}
        </ul>
      </div>
      <Modal show={showCreateGroup} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Nuevo grupo personal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
            <Row>
              <Col> </Col>
              <Col style={{ textAlign: "center" }}>
                <h4>
                  <Form.Control
                    className="m-3 mt-0 mb-0 controled-input-2"
                    size="sm"
                    value={newArray.nombre}
                    onChange={(e) =>
                      setNewArray((ga) => ({ ...ga, nombre: e.target.value }))
                    }
                    placeholder={newArray.nombre}
                  />
                </h4>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="dropeable-list">
                  <Form onSubmit={handleChange}>
                    <Form.Control
                      name="search"
                      className="controled-input"
                      type="text"
                      placeholder=" buscador empleados..."
                    />
                  </Form>
                  <Droppable droppableId={groupConstant.id}>
                    {(provided) => (
                      <ul
                        className="dropeable-container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {groupConstant.items.map(({ id, nombre }, index) => {
                          return (
                            <Draggable key={id} draggableId={id} index={index}>
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
                  <Droppable droppableId={newArray.id}>
                    {(provided) => (
                      <ul
                        className="dropeable-container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {newArray.items.map(({ id, nombre }, index) => {
                          return (
                            <Draggable key={id} draggableId={id} index={index}>
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
            </Row>
          </DragDropContext>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={CreateNewGroup}> Crear nuevo grupo </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
