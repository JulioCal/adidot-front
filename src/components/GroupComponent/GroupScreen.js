/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button, Form, Modal } from "react-bootstrap";
import CredentialContext from "../../Contexts/CredentialContext";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import Constants from "../Constants";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "./GroupScreen.css";

export default function GroupScreen() {
  const columnsFromBackend = {
    id: uuidv4(),
    name: "Gerencias constantes",
    items: Constants(),
  };

  const ColumnsToBackend = {
    id: uuidv4(),
    name: "Nuevo grupo",
    items: [],
  };

  const URL_API = "http://localhost:8000/api/";
  const [location, setLocation] = useLocation();
  const { logData } = useContext(CredentialContext);
  const [showCreateGroup, setShow] = useState(false);
  const [groupArray, setGroups] = useState({ items: [], name: "user groups" });
  const [groupConstant, setConstant] = useState(columnsFromBackend);
  const [newArray, setNewArray] = useState(ColumnsToBackend);
  const [allTrabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    if (!logData.isLogged) {
      setLocation("/");
    }
    let headers = setHeaders();
    axios
      .get(URL_API + "trabajador", { headers })
      .then((response) => console.log(response.data))
      .then(console.log(allTrabajadores));
    //axios.get(URL_API+'groups').then(response => setGroups((groupArray) => ({ ...groupArray, items: response.data })));
  }, [location, logData.isLogged]);

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
    //axios.post(URL_API+'groups, newArray, {headers}). then(response => console.log(response))
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
      <div className="Header-noticia m-2 mt-4 mb-0">
        <h3 className="titulo">Grupos personales</h3>
      </div>
      <div className="Body-group">
        <span className="plus-button" onClick={handleShow}>
          <FaPlus></FaPlus>
        </span>
        <ul className=" ul-dp ">
          {groupArray.items.length > 0
            ? groupArray.items.map(({ name }) => (
                <li className="dli">
                  {name}
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
            <div className="dropeable-list">
              <Droppable droppableId={groupConstant.id}>
                {(provided) => (
                  <ul
                    className="dropeable-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <Form>
                      <Form.Control
                        className="controled-input"
                        type="text"
                        placeholder=" buscador empleados..."
                      />
                    </Form>
                    {groupConstant.items.map(({ id, name }, index) => {
                      return (
                        <Draggable key={id} draggableId={id} index={index}>
                          {(provided) => (
                            <li
                              className="dropeable-list-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {name}
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
            <div className="dropeable-list">
              <Droppable droppableId={newArray.id}>
                <h3>{newArray.name}</h3>
                {(provided) => (
                  <ul
                    className="dropeable-container"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {newArray.items.map(({ id, name }, index) => {
                      return (
                        <Draggable key={id} draggableId={id} index={index}>
                          {(provided) => (
                            <li
                              className="dropeable-list-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {name}
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
          </DragDropContext>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={CreateNewGroup}> Crear nuevo grupo </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
