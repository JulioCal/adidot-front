/* eslint-disable no-unused-vars */
import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Form,
  Modal,
  Row,
  Col,
  Stack,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import Document from "../DocumentComponent/Document";
import DocumentContext from "../../Contexts/DocumentContext";
import CredentialContext from "../../Contexts/CredentialContext";
import { PulseLoader } from "react-spinners";
import Constants from "../Helpers/Constants";
import axios from "axios";
import { useLocation } from "wouter";
import "./Login.css";

export default function Login() {
  //formulario de inicio de sesion, hypervinculo para recuperacion de credenciales.
  //helpers
  const API_URL = `http://localhost:8000/api`;
  let loginScreen;
  const [Gerencias] = useState(Constants);
  const [location, pushLocation] = useLocation();
  //data states
  const { data, updateData } = useContext(DocumentContext);
  const { logData, setLog } = useContext(CredentialContext);
  const [history, setHistory] = useState([]);
  //loading States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    variant: "",
    message: "",
    show: false,
  });
  const [show, setShow] = useState(false);
  //Form states
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  useEffect(() => {
    if (data != null) {
      setHistory(data.slice(-6, -4));
    }
  }, [data]);

  const onSubmit = (datax, e) => {
    reset();
    handleClose();
    axios
      .post(API_URL + `/trabajador`, datax)
      .then((response) => Toaster("success", response.data.message))
      .catch((error) => {
        Toaster("danger", "hubo un error creando el usuario");
      });
  };

  function Toaster(variant, message) {
    setToast({ show: true, variant: variant, message: message });
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const setHeaders = () => {
    let token = window.sessionStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    return headers;
  };

  //metodo para comparacion de datos del login y generacion de token.
  const handleLogin = (e) => {
    let formData = new FormData();
    //preventDefault evita que la pagina se recargue constantemente.
    e.preventDefault();
    setLoading(true);
    formData.append("cedula", e.target.cedula.value);
    formData.append("password", e.target.password.value);
    axios
      .post(API_URL + "/trabajador/auth", formData)
      .then((Response) => {
        window.sessionStorage.setItem("token", Response.data.access_token);
        let headers = setHeaders();
        axios.get(API_URL + "/me", { headers }).then((Response) => {
          window.sessionStorage.setItem("user", JSON.stringify(Response.data));
          setLog((logData) => ({
            ...logData,
            login: Response.data.nombre,
            role: Response.data.role,
            gerencia: Response.data.gerencia,
            cedula: Response.data.cedula,
            isLogged: true,
          }));
          setLoading(false);
        });
      })
      .catch((error) => {
        Toaster("danger", "los Datos no concuerdan con nuestros registros");
        setLoading(false);
      });
  };

  //salida del sistema y borrado de token
  const exit = (e) => {
    e.preventDefault();
    let headers = setHeaders();
    axios
      .get(API_URL + "/logout", { headers })
      .then(() => {
        setLog((logData) => ({
          ...logData,
          login: "",
          role: "",
          gerencia: "",
          cedula: "",
          isLogged: false,
        }));
      })
      .catch((error) => {
        console.log(error);
      });
    window.sessionStorage.clear();
    setLoading(false);
  };

  const handleRecovery = (e) => {
    e.preventDefault();
    pushLocation("/recovery");
  };

  const handleChange = (e) => {
    e.preventDefault();
    setLog((logData) => ({ ...logData, login: e.target.value }));
  };
  //logica para mostrar datos del usuario o ventana de login.
  if (logData.isLogged) {
    loginScreen = (
      <Form onSubmit={exit}>
        <p class="stroke">
          <svg
            style={{ height: "5rem" }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 600 180"
          >
            <text x="100" y="50">
              {logData.login}
            </text>
            <text x={logData.role === "Analista" ? "20%" : "0"} y="140">
              Rol: {logData.role}
            </text>
          </svg>
        </p>
        <Button
          size="sm"
          variant="secondary"
          className="Exit-button"
          type="submit"
        >
          {" "}
          Salir{" "}
        </Button>
      </Form>
    );
  } else {
    loginScreen = (
      <Form onSubmit={handleLogin}>
        <h5 className="Login-title mt-3 mb-2 ">Ingreso al sistema</h5>
        <Form.Control
          type="text"
          className="mb-2 login-input"
          name="cedula"
          onChange={handleChange}
          defaultValue={logData.login}
          placeholder="Numero de Cedula"
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault();
            }
          }}
        />
        <Form.Control
          type="password"
          className="mb-2 login-input"
          name="password"
          defaultValue={logData.key}
          placeholder="********"
        />
        <Button
          size="sm"
          variant="success"
          className="Login-button"
          type="submit"
        >
          {" "}
          Entrar{" "}
        </Button>
        <Button size="sm" variant="secondary" onClick={handleRecovery}>
          {" "}
          ??olvid?? su clave?{" "}
        </Button>
        <p className="entry-link" onClick={handleShow}>
          nuevo? registrate aqu??.
        </p>
      </Form>
    );
  }

  return (
    <>
      <ToastContainer className="p-3">
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ variant: "", message: "", show: false })}
          show={toast.show}
          delay={10000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Adidot</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      <div className="Login">
        {loading ? (
          <PulseLoader id="loader" color={"#eee"} loading={loading} />
        ) : (
          loginScreen
        )}
      </div>
      {history.map(({ document_id, title, img, text, owner, created_at }) => (
        <Document
          key={document_id}
          id={document_id}
          title={title}
          img={img}
          date={new Date(created_at)}
          text={text}
          owner={owner}
        />
      ))}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Registro nuevo usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Body>
            <Row>
              <Col>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="text"
                  placeholder="Nombre completo"
                  onKeyPress={(event) => {
                    if (/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  {...register("nombre", { required: true })}
                />
                {errors.nombre && (
                  <span className="Error">Por favor llena este campo*</span>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Numero de Cedula</Form.Label>
                <Stack direction="horizontal">
                  <Col xs={2}>
                    <Form.Select {...register("cedulaprefix")}>
                      <option>V</option>
                      <option>E</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Control
                      id="inlineFormInputGroup"
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      placeholder="-------"
                      {...register("cedula", { required: true })}
                    />
                    {errors.cedula && (
                      <span className="Error">Por favor llena este campo*</span>
                    )}
                  </Col>
                </Stack>
              </Col>
              <Col>
                <Form.Label>Direccion de Correo</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="email"
                  placeholder="correo@corpozulia.com"
                  {...register("email", {
                    required: true,
                    pattern:
                      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  })}
                />
                {errors.email && (
                  <span className="Error">Por favor llena este campo*</span>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Sexo</Form.Label>
                <Form.Select className="mb-3" {...register("sexo")}>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>Otro</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Rol desempe??ado</Form.Label>
                <Form.Select className="mb-3" {...register("role")}>
                  {/*<option>Administrador</option>*/}
                  <option>Analista</option>
                  <option>Gerente</option>
                </Form.Select>
              </Col>
              <Col>
                <Form.Label>Gerencia a la que pertenece</Form.Label>
                <Form.Select
                  className="mb-3"
                  {...register("gerencia", { required: true })}
                >
                  {Gerencias.map(({ id, name }) => (
                    <option key={id}>{name}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Direcci??n</Form.Label>
                <Form.Control
                  className="mb-3"
                  as="textarea"
                  rows={4}
                  {...register("direccion")}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Contrase??a</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="password"
                  placeholder="********"
                  {...register("password", { required: true })}
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z0-9!@#$%\^&*)(+=._-]*$/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                />
                {errors.password && (
                  <span className="Error">
                    Recuerda, una contrase??a debe tener almenos 8 caracteres.*
                  </span>
                )}
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Label>Confirmar Contrase??a</Form.Label>
                <Form.Control
                  className="mb-3"
                  type="password"
                  placeholder="********"
                  onKeyPress={(event) => {
                    if (!/[a-zA-Z0-9!@#$%\^&*)(+=._-]*$/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  {...register("passwordConfirm", {
                    required: "porfavor verifique la contrase??a",
                    validate: {
                      matchesPreviousPassword: (value) => {
                        const { password } = getValues();
                        return (
                          password === value || "Las contrase??as no son iguales"
                        );
                      },
                    },
                  })}
                />
                {errors.passwordConfirm && (
                  <span className="Error">
                    Las contrase??as no son iguales*{" "}
                  </span>
                )}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={handleClose}>
              Cerrar
            </Button>
            <Button type="submit" variant="success">
              Crear usuario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
