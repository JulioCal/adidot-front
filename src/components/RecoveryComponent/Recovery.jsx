import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { IoReturnUpBack } from "react-icons/io5";
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import axios from "axios";
import "./Recovery.css";

export default function Recovery() {
  const API_URL = "http://localhost:8000/api/";
  const [sent, setResponse] = useState(false);
  const [location, pushLocation] = useLocation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ mode: "onBlur" });

  const sendEmail = (data, e) => {
    e.preventDefault();
    setResponse(true);
    console.log(data.type);
    console.log(data.value);
    axios
      .post(API_URL + "mail/send", data)
      .then((response) => pushLocation("/"));
    reset();
  };

  return (
    <>
      <div className="recovery-container">
        <Card>
          <Form onSubmit={handleSubmit(sendEmail)}>
            <Card.Header as="h4">
              <Row>
                <Col xs={2}>
                  <span
                    className="Fa-edit-alt"
                    onClick={() => window.history.go(-1)}
                  >
                    <IoReturnUpBack></IoReturnUpBack>
                  </span>
                </Col>
                <Col style={{ textAlign: "justify" }}>
                  <span>Recupere su contraseña</span>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="card-text-alt">
              {sent ? (
                <Row style={{ width: "25vw" }}>
                  <Col>
                    <p>
                      Si los datos que suministro son correctos, le enviaremos
                      un correo para reestablecer su contraseña.
                    </p>
                  </Col>
                </Row>
              ) : (
                <>
                  <Form.Label>Ingrese sus datos para reestablecer</Form.Label>
                  <Row style={{ width: "25vw" }}>
                    <Col xs={4}>
                      <Form.Select name="option" {...register("type")}>
                        <option value="cedula">cedula</option>
                        <option value="email">correo</option>
                      </Form.Select>
                    </Col>
                    <Col>
                      <Form.Control type="text" {...register("value")} />
                    </Col>
                  </Row>
                </>
              )}
            </Card.Body>
            <Card.Footer className="text-muted">
              {sent ? null : (
                <Button type="submit" variant="success">
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
