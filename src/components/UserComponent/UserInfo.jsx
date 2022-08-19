import CredentialContext from "../../Contexts/CredentialContext";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button, Form, Col, Row, Toast, ToastContainer } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { ScaleLoader } from "react-spinners";
import "./UserInfo.css";
import axios from "axios";

export default function UserInfo() {
  const API_URL = "http://localhost:8000/api/";
  const { logData } = useContext(CredentialContext);
  const [location, pushLocation] = useLocation();
  const [toast, setToast] = useState({ show: false, variant: "", message: "" });
  const [loading, setLoad] = useState(false);
  const [userInfo, setInfo] = useState([]);
  const [edit, setEdit] = useState(false);
  const {
    register,
    onChange,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  function Toaster(variant, message) {
    setToast({ show: true, variant: variant, message: message });
  }

  useEffect(() => {
    if (!logData.isLogged) {
      pushLocation("/");
    } else {
      let headers = setHeaders();
      setLoad(true);
      axios
        .get(API_URL + `trabajador/${logData.cedula}`, { headers })
        .then((response) => {
          setInfo(response.data);
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
          Toaster("danger", "Ocurrio un error al recuperar los datos.");
        });
    }
  }, [logData.isLogged]);

  const updateUserdata = (e, data) => {
    e.preventDefault();
    console.log("actualizar datos");
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
          {loading ? (
            <ScaleLoader className="p-2" height={20} color={"#efefef"} />
          ) : (
            <h3 className="titulo p-2">{userInfo.nombre}</h3>
          )}
          <span className="Fa-edit" onClick={() => setEdit(!edit)}>
            <FaEdit></FaEdit>
          </span>
        </div>
        <Form onSubmit={handleSubmit(updateUserdata)}>
          <div className="Body-noticia-alt p-2">
            <Row>
              <Col className="Col-alt">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  disabled={edit ? false : true}
                  defaultValue={userInfo.nombre}
                  className={edit ? "" : "transparent"}
                  {...register("nombre")}
                />
              </Col>
              <Col className="Col-alt">
                <Form.Label>Rol desempeñado</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  className={edit ? "" : "transparent"}
                  defaultValue={userInfo.role}
                />
              </Col>
            </Row>
            <Row>
              <Col className="Col-alt">
                <Form.Label>Gerencia</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  className={edit ? "" : "transparent"}
                  defaultValue={userInfo.gerencia}
                />
              </Col>
              <Col className="Col-alt">
                <Form.Label>Estatus</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  className={edit ? "" : "transparent"}
                  defaultValue={userInfo.estatus}
                />
              </Col>
            </Row>
            <Row>
              <Col className="Col-alt">
                <Form.Label>Cedula</Form.Label>
                <Form.Control
                  type="text"
                  disabled
                  defaultValue={userInfo.cedula}
                />
              </Col>
              <Col className="Col-alt">
                <Form.Label>Correo electronico</Form.Label>
                <Form.Control
                  type="text"
                  disabled={edit ? false : true}
                  className={edit ? "" : "transparent"}
                  defaultValue={userInfo.email}
                  {...register("email")}
                />
              </Col>
            </Row>
            {edit ? (
              <Row>
                <Col className="Col-alt">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="*******"
                    {...register("password")}
                    onKeyPress={(event) => {
                      if (!/[a-zA-Z0-9!@#$%\^&*)(+=._-]*$/.test(event.key)) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Col>
                <Col className="Col-alt">
                  <Form.Label>Confirmar contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="*******"
                    {...register("passwordConfirm", {
                      required: "porfavor verifique la contraseña",
                      validate: {
                        matchesPreviousPassword: (value) => {
                          const { password } = getValues();
                          return (
                            password === value ||
                            "Las contraseñas no son iguales"
                          );
                        },
                      },
                    })}
                  />
                </Col>
              </Row>
            ) : null}
            <Row>
              <Col className="Col-alt">
                <Form.Label>Direccion</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  className={edit ? "" : "transparent"}
                  disabled={edit ? false : true}
                  defaultValue={userInfo.direccion}
                  {...register("direccion")}
                />
              </Col>
            </Row>
          </div>
          <div className="Footer-noticia">
            {edit ? (
              <Button type="submit" variant="success">
                Actualizar datos
              </Button>
            ) : null}
          </div>
        </Form>
      </div>
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
    </>
  );
}
