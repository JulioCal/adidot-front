import React, { useState, useEffect, useContext } from "react";
import CredentialContext from "./CredentialContext";
import { useLocation } from "wouter";
import axios from "axios";

const Context = React.createContext({});
const API_URL = `http://localhost:8000/api`;

export function DocumentContextProvider({ children }) {
  const { logData } = useContext(CredentialContext);
  const [data, updateData] = useState([]);
  const [location] = useLocation();
  useEffect(() => {
    if (location === "/") {
      if (logData.isLogged) {
        axios
          .get(API_URL + "/document", {
            params: { owner: logData.cedula },
          })
          .then((response) => {
            updateData(response.data.reverse());
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      } else {
        axios
          .get(API_URL + "/document", {
            params: { permit: "public" },
          })
          .then((response) => {
            updateData(response.data.reverse());
          })
          .catch((error) => {
            console.error("There was an error!", error);
          });
      }
    }
  }, [location, logData.isLogged]);

  return (
    <Context.Provider value={{ data, updateData }}>{children}</Context.Provider>
  );
}
export default Context;
