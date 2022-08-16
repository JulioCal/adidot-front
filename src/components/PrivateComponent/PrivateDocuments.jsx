/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext, useMemo} from 'react';
import Document from '../DocumentComponent/Document';
import CredentialContext from "../../Contexts/CredentialContext";
import Pagination from '../PaginationComponent/Pagination';
import { PulseLoader } from 'react-spinners';
import {useLocation} from 'wouter'
import axios from 'axios';

export default function PrivateDocuments(){
    //Galeria donde se exhiben los nuevos documentos y notificaciones.
    const API_URL = `http://localhost:8000/api`;
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useLocation();
    const [privateData, setData] = useState([])
    const {logData, setLog} = useContext(CredentialContext);

    //pagination values.
    let PageSize = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const currentData = useMemo(() => {
      const firstPageIndex = (currentPage - 1) * PageSize;
      const lastPageIndex = firstPageIndex + PageSize;

      return privateData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage,location,privateData]);

  useEffect(() => {
    if(!logData.isLogged) { setLocation('/') }
    setLoading(true);
    axios.get(API_URL + '/document', {
        params: {
            owner: logData.cedula,
            permit: 'private'
        }
    }).then((response) => {
        setData(response.data.reverse())
        setLoading(false)
    })
    .catch(error => {console.error('There was an error!', error); });
  },[location])
        return (
          <>
            <div className='Galeria-noticias'>
          <PulseLoader id='loader' loading={loading} color={'#add8e6'} />
          {currentData.map(({document_id,title,img,text,owner}) => <Document key={document_id} id={document_id} title={title} img={img} text={text} owner={owner} />)}
          <Pagination className="pagination-bar" currentPage={currentPage} totalCount={privateData.length} pageSize={PageSize} onPageChange={page => setCurrentPage(page)} />
            </div>
          </>
        );
}