import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { IoReturnUpBack } from "react-icons/io5";
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Recovery.css";

export default function PasswordReset(params) {
  const API_URL = "http://localhost:8000/api/";
  const [sent, setResponse] = useState(false);
  const [location, pushLocation] = useLocation();
  const [toast, setToast] = useState({ show: false, variant: "", message: "" });
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const sendEmail = (data, e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("password", data.password);
    formData.append("token", params.params.token);
    axios
      .post(API_URL + "trabajador/password/reset", formData)
      .then((response) => {
        Toaster("success", response.data.message);
        setTimeout(() => {
          pushLocation("/");
        }, 3000);
      })
      .catch((err) => {
        Toaster("danger", "El token ya ha sido utilizado o expirado");
      });
    setResponse(true);
    reset();
  };

  function Toaster(variant, message) {
    setToast({ show: true, variant: variant, message: message });
  }

  return (
    <>
      <ToastContainer className="p-3" style={{ zIndex: "3" }}>
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ show: false, variant: "", message: "" })}
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
      <div className="recovery-container">
        <Card>
          <Form onSubmit={handleSubmit(sendEmail)}>
            <Card.Header as="h4" className="Header-noticia">
              <Row>
                <Col xs={2}>
                  <span className="Fa-edit" onClick={() => pushLocation("/")}>
                    <IoReturnUpBack></IoReturnUpBack>
                  </span>
                </Col>
                <Col style={{ textAlign: "justify", color: "white" }}>
                  <span>Reestablezca su contraseña</span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="card-text-alt">
              <>
                <Form.Label className="mb-3">
                  Ingrese su nueva contraseña
                </Form.Label>
                <Row style={{ width: "25vw" }}>
                  <Col>
                    <Form.Label>Nueva Contraseña</Form.Label>
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
                        Recuerda, una contraseña debe tener almenos 8
                        caracteres.*
                      </span>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Label>Confirmar Nueva Contraseña</Form.Label>
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
                    {errors.passwordConfirm && (
                      <span className="Error">
                        Las contraseñas no son iguales*{" "}
                      </span>
                    )}
                  </Col>
                </Row>
              </>
            </Card.Body>
            <Card.Footer
              className="text-muted Footer-noticia"
              style={{ justifyContent: "center" }}
            >
              {sent ? null : (
                <Button
                  type="submit"
                  variant="success"
                  style={{ margin: "0px" }}
                >
                  Enviar
                </Button>
              )}
            </Card.Footer>
          </Form>
        </Card>
      </div>
    </>
  );
}
