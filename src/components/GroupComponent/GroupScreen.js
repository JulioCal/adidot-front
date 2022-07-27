/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useContext} from 'react'
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

export default function GroupScreen() {
    const URL_API = 'http://localhost:8000/api/';
    const [location, setLocation] = useLocation();
    const {logData} = useContext(CredentialContext);

    useEffect(() => {
        if(!logData.isLogged) {
            setLocation('/');
        }
        axios.get(URL_API+'groups').then(response => console.log(response))
    },[location])

    return(<>

    </>)
}