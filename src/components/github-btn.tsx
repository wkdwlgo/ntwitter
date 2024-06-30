import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import styled from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
const Button= styled.span`
    background-color: white;
    font-weight:500;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: black;
    margin-top: 50px;
`;

const Logo= styled.img`
    height: 25px;
`;

export default function GithubButton(){
    const navigate=useNavigate();
    const onClick= async ()=>{
        try{
            const Provdier = new GithubAuthProvider();
            await signInWithPopup(auth,Provdier)
            navigate("/");
        }
        catch(error){
            console.log(error);
        }
    }
    return <Button onClick={onClick}>
        <Logo src="/github-mark.svg"/>
        Continue with Github
    </Button>
}