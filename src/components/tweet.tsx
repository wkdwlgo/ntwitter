import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { auth, storage } from "../firebase";
import { ITweet } from "./timeline";
import styled from "styled-components";
import { db } from "../firebase";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";

const Wrapper=styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border:1px solid rgba(255,255,255,0.5);
    border-radius: 15px;
`;

const Column=styled.div`
    align-items: center;
    justify-content: center;
`;

const Photo=styled.img`
    width: 100px;
    height: 100px;
    border-radius:15px;
`;

const Username= styled.span`
    font-weight: 700;
    font-size: 15px;
`;

const Payload=styled.p`
    margin: 10px 0px;
    font-size: 18px;
`;

const DeleteButton= styled.button`
    background-color:tomato;
    color:white;
    font-weight: 600;
    border:0;
    font-size: 12px;
    padding:5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const CorrectionButton= styled.button`
    margin-left: 15px;
    background-color:tomato;
    color:white;
    font-weight: 600;
    border:0;
    font-size: 12px;
    padding:5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
`;

const CorrectionTextArea=styled.textarea`
    margin: 10px 10px 10px 0 ;
    font-size: 18px;
    border:  2px solid white;
    background-color: black;
    resize: none;
    width: 100%;
    color:white;
`;

const SubmitBtn=styled.input`
    background-color:tomato;
    color:white;
    font-weight: 600;
    border:0;
    font-size: 12px;
    padding:5px 10px;
    text-transform: uppercase;
    border-radius: 5px;
    cursor: pointer;
    &:hover, 
    &:active{
        opacity: 0.9;
    }
`;

export default function Tweet({username, photo, tweet,userId,id}:ITweet){
    const [edit, setEdit]=useState(false);
    const [isLoading, setLoading]=useState(false);
    const [newTweets, setNewTweets]=useState(tweet);
    const user=auth.currentUser;
    const onDelete= async()=>{
        const ok=confirm("Are you sure you want to delete this tweet?")
        if(!ok || user?.uid!==userId) return;
        try{
            await deleteDoc(doc(db,"tweets",id));
            if(photo){
                const photoRef= ref(storage,`tweets/${user.uid}/${id}`);
                await deleteObject(photoRef);
            }
        }
        catch(e){
            console.log(e);
        }
        finally{
            
        }
    }
    const onEdit =()=>{
        if(user?.uid!==userId) return;
        setEdit(true);
    }
    const onChange=(e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewTweets(e.target.value);
    }
    const onSubmit=async()=>{
        const ok=confirm("Are you sure you want to edit this tweet?")
        if(!ok || user?.uid!==userId) return;
        try{
            setLoading(true);
            await updateDoc(doc(db,"tweets",id),{
                tweet:newTweets,
            });
            setEdit(false);
            setNewTweets(newTweets);
        }
        catch(e){
            console.log(e);
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {edit ? <CorrectionTextArea  value={newTweets} onChange={onChange} rows={5} maxLength={180} required>{tweet}</CorrectionTextArea>:<Payload>{tweet}</Payload>}
                {user?.uid===userId && !edit ? <DeleteButton onClick={onDelete}>Delete</DeleteButton>: null}
                {user?.uid===userId && !edit ? <CorrectionButton onClick={onEdit} >Edit</CorrectionButton>: null}
                {edit ? <SubmitBtn onClick={onSubmit} type="submit" value={isLoading ? "Editing..." : "Edit Tweet"}/>:null}
            </Column>
            <Column>
            {photo ? <Photo src={photo}/>:null}
            </Column>
        </Wrapper>
    )
}