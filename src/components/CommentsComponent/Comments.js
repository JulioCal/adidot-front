import React, { useState,useEffect, useContext, useMemo } from "react";
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Comments.css';
import CredentialContext from "../../Contexts/CredentialContext";

export default function Comments(params) {
    
    const [comment, updateComment] = useState([]);
    const [text, updateText] = useState('');
    //logged should be a global variable, so all components can access the data. 
    const {logData, setLog} = useContext(CredentialContext)
    const Comments = comment.map((comment) => <li className="comment" >{comment.text +'. '+ comment.owner + ':' + comment.date}</li>
    )
    const doc = params.params;

    let currDate = new Date();

    const handleSubmit = evt => {
        evt.preventDefault();
        console.log(text);
        if(evt.target[0].value.replace(/\s/g,'').length>=1) {
            let newcomment = evt.target[0].value
            console.log(newcomment)
            console.log(doc)
          }
          else {
            alert('empty comment');
          }
    }
    const handleChange = evt => {
        evt.preventDefault();
        updateText(evt.target.value);
    }

    const createComment = async (e) => {
      e.preventDefault();
      const formData = new FormData()
      formData.append('owner', logData.user)
      formData.append('comment', text);
      formData.append('parent', doc.id);
      //loading object start
      await axios.post(`http://localhost:8000/api/comment`, formData).then(({data})=>{
      //loading object drop. 
      alert(data.message)
      }).catch(({response})=>{
          console.log(response.data.message)
      })
    }

    useEffect( function () {
        //updateComment(params.params.comments);
    },[]);

    return(<>
        <div className="Comments" >
            <ul className="comment-container">{Comments}</ul>
        </div>
        {logData.isLogged ?
        <Form onSubmit={handleSubmit}>
               <textarea className='Comment-text' rows={5} onChange={handleChange} value={text}></textarea>
               <Button className='Comment-button' size="sm" variant="success" type='submit'> Publicar comentario </Button>
        </Form>
         : null}
    </>
    );

}