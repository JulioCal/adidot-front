/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect, useContext} from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
    Button,
    Form,
    Row,
    Col,
    Stack,
  } from "react-bootstrap";
  import { useForm } from "react-hook-form";
import CredentialContext from "../../Contexts/CredentialContext"
import { FaPlus } from 'react-icons/fa'
import {useLocation} from 'wouter'
import axios from 'axios'
import Constants from '../Constants';
import './GroupScreen.css'
import {v4 as uuidv4} from 'uuid'

export default function GroupScreen() {
    const columnsFromBackend = { 
        id: uuidv4(),
        name: "Requested",
        items: Constants()
      }
    
    const ColumnsToBackend = {
      id: uuidv4(),
      name:'given',
      items: []
    }

    const URL_API = 'http://localhost:8000/api/';
    const [location, setLocation] = useLocation();
    const {logData} = useContext(CredentialContext);
    const [groupArray, setArray] = useState(columnsFromBackend)
    const [newArray, setNewArray] = useState(ColumnsToBackend);

    useEffect(() => {
        if(!logData.isLogged) {
            setLocation('/');
        }
        //axios.get(URL_API+'groups').then(response => console.log(response))
    },[location, logData.isLogged])

    function onDragEnd(result, columns, setColumns) {
      if (!result.destination) return;
      const { source, destination } = result;
      if (source.droppableId !== destination.droppableId) {
        const sourcItems = Array.from(groupArray.items);
        const destItems = Array.from(newArray.items);
        const [removedItem] = sourcItems.splice(source.index, 1);
        destItems.splice(destination.index,0,removedItem);
        setArray(groupArray => ({...groupArray, items: sourcItems}));
        setNewArray(newArray => ({...newArray, items: destItems}));
      } else {
        const items = Array.from(groupArray.items);
        const [reorderedItem] = items.splice(source.index, 1);
        items.splice(destination.index, 0, reorderedItem);
        setArray(groupArray => ({...groupArray, items: items}));
      }
    }
    return (
      <DragDropContext onDragEnd={result => onDragEnd(result)}>
        <span
          className="plus-button"
          onClick={() => { console.log("crear grupo action"); }}>
        <FaPlus></FaPlus>
        </span>
          <div className="dropeable-list">
            <Droppable droppableId={groupArray.id} >
              {(provided) => 
                  <ul className="dropeable-container" {...provided.droppableProps} ref={provided.innerRef}>
                      <Form>
                        <Form.Control type="text" placeholder=" buscador empleados..."  />
                      </Form>
                      {groupArray.items.map(({id, name}, index) =>   
                          {return (
                          <Draggable key={id} draggableId={id} index={index}>
                              {(provided) => (<li className='dropeable-list-item' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{name}</li>)}
                          </Draggable>)})}
                      {provided.placeholder}
                  </ul>}
            </Droppable>
            </div>
          <div className="dropeable-list">
            <Droppable droppableId={newArray.id} >
              {(provided) => 
                  <ul className="dropeable-container" {...provided.droppableProps} ref={provided.innerRef}>
                      {newArray.items.map(({id,name}, index) =>   
                          {return (
                          <Draggable key={id} draggableId={id} index={index}>
                              {(provided) => (<li className='dropeable-list-item' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{name}</li>)}
                          </Draggable>)})}
                      {provided.placeholder}
                  </ul>}
            </Droppable>
            </div>
      </DragDropContext>
    );
}