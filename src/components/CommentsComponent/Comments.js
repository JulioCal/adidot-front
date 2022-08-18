import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Form, Button, Toast, ToastContainer } from "react-bootstrap";
import { ScaleLoader } from "react-spinners";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Comments.css";
import CredentialContext from "../../Contexts/CredentialContext";

export default function Comments(params) {
  const API_URL = "http://localhost:8000/api/";
  const { logData } = useContext(CredentialContext);
  const [comment, updateComment] = useState([]);
  const [toast, setToast] = useState({ show: false, variant: "", message: "" });
  const [buttonLoading, setBLoading] = useState(false);
  const [edit, toggleEdit] = useState(false);
  const [text, updateText] = useState("");
  const doc = params.params;

  const createComment = (e) => {
    e.preventDefault();
    if (e.target[0].value.replace(/\s/g, "").length >= 1) {
      setBLoading(true);
      const formData = new FormData();
      formData.append("owner", logData.login);
      formData.append("comment", text);
      formData.append("document_id", doc.document_id);
      axios
        .post(API_URL + `comment`, formData)
        .then((response) => {
          Toaster("success", response.data.message);
          reset();
          setBLoading(false);
        })
        .catch(({ error }) => {
          Toaster("danger", error.message);
          setBLoading(false);
        });
    } else {
      Toaster("danger", "no puede publicar comentarios vacios");
    }
  };

  const reset = () => {
    updateText("");
  };

  function deleteComment(id) {
    Toaster("secondary", "Porfavor espere, estamos procesando su solicitud");
    axios
      .delete(API_URL + `comment/${id}`)
      .then((response) => Toaster("success", "comentario eliminado"));
  }

  useEffect(() => {
    if (doc.trabajador_cedula === logData.cedula) {
      toggleEdit(true);
    }
    axios
      .get(API_URL + "comment", {
        params: { document: doc.document_id },
      })
      .then((response) => {
        response.data.forEach((comment) => {
          comment.created_at = new Date(comment.created_at);
        });
        updateComment(response.data);
      })
      .catch((err) => {
        Toaster("danger", err.message);
      });
  }, [toast]);

  const handleChange = (evt) => {
    evt.preventDefault();
    updateText(evt.target.value);
  };

  function Toaster(variant, message) {
    setToast({ show: true, variant: variant, message: message });
  }
  return (
    <>
      <ToastContainer className="p-3">
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
      <div className="comments">
        <ul className="comment-container mt-2">
          {comment.map(({ id, comment, owner, created_at }) => (
            <li className="comment">
              <span className="comment-text-alt">{comment}</span>
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                {owner +
                  " " +
                  created_at.getDate() +
                  "/" +
                  (created_at.getMonth() + 1)}
                {edit ? (
                  <span
                    onClick={() => {
                      deleteComment(id);
                    }}
                    className="Fa-edit-alt"
                  >
                    <FaTrash />
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ul>
      </div>
      {logData.isLogged ? (
        <Form onSubmit={createComment}>
          <textarea
            className="comment-text"
            rows={5}
            onChange={handleChange}
            value={text}
          ></textarea>
          {buttonLoading ? (
            <ScaleLoader
              className="loader mt-2"
              height={20}
              color={"#cecece"}
            />
          ) : (
            <Button
              className="comment-button"
              size="sm"
              variant="success"
              type="submit"
            >
              {" "}
              Publicar comentario{" "}
            </Button>
          )}
        </Form>
      ) : null}
    </>
  );
}
