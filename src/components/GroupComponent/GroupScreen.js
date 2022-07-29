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
    Toast,
    ToastContainer,
  } from "react-bootstrap";
  import { useForm } from "react-hook-form";
import CredentialContext from "../../Contexts/CredentialContext"
import {useLocation} from 'wouter'
import axios from 'axios'
import Constants from '../Constants';
import './GroupScreen.css'

export default function GroupScreen() {
    const URL_API = 'http://localhost:8000/api/';
    const [location, setLocation] = useLocation();
    const {logData} = useContext(CredentialContext);
    const Gerencias = Constants;
    const [groupArray, setArray] = useState(Gerencias);
    useEffect(() => {
        if(!logData.isLogged) {
            setLocation('/');
        }
        //axios.get(URL_API+'groups').then(response => console.log(response))
    },[location])

    function handleOnDragEnd(result) {
      if(!result.destination) return;
        const items = Array.from(groupArray);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setArray(items);
    }

    return (
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <span
          onClick={() => {
            console.log("crear grupo action");
          }}
        >
          {" "}
          \+/{" "}
        </span>
        {/*mostrar lista de grupos del usuario. */}
        {/*modal de creacion de nuevo grupo */}
        <div className="dropeable-list">
          <Droppable droppableId="dropeable-container">
            {(provided) => 
                <ul className="dropeable-container" {...provided.droppableProps} ref={provided.innerRef}>
                    {groupArray.map(({id,name}, index) =>   
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