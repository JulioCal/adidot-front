import { useEffect, useState, useContext, useMemo} from 'react';
import DocsContext from '../../Contexts/DocumentContext';
import Document from '../DocumentComponent/Document';
import { PulseLoader } from 'react-spinners';
import Pagination from '../PaginationComponent/Pagination';
import {useLocation} from 'wouter';
import './Display.css';

export default function Display(){
    //Galeria donde se exhiben los nuevos documentos y notificaciones.
    const {data} = useContext(DocsContext);
    const [location, setLocation] = useLocation();
    const [loading, setLoading] = useState(true);
    const value = useMemo(()=> {return data}, [data]);
    //pagination values.
    let PageSize = 4;
    const [currentPage, setCurrentPage] = useState(1);

    const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return value.reverse().slice(firstPageIndex, lastPageIndex);
  }, [currentPage, value]);
    
    useEffect(() => { 
      setLoading(true);
      if(data.length > 0) { 
        setTimeout(() => {
          setLoading(false);
        },2500)}
      },[currentData]);

        return (
          <>
            <div className='Galeria-noticias'>
          {loading ? <PulseLoader id='loader' color={'#add8e6'} />
          : currentData.map(({id,title,img,text,owner}) => <Document key={id} id={id} title={title} img={img} text={text} owner={owner} />)}
          </div>
          <Pagination className="pagination-bar" currentPage={currentPage} totalCount={data.length} pageSize={PageSize} onPageChange={page => setCurrentPage(page)} />
          </>
        );
}