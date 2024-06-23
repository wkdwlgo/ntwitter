import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import { Error, Input, Switcher, Title, Wrapper,Form } from "../components/auth-components";
import GithubButton from "../components/github-btn";


export default function CreateAccount(){
    const navigate=useNavigate();
    const [isLoading, setLoading]=useState(false);
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [error, setError]=useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const{target:{name, value}}=e;
        if(name === "name"){
            setName(value)
        }
        else if(name==="email"){
            setEmail(value)
        }
        else if(name==="password"){
            setPassword(value)
        }
    }
    const onSubmit=async (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError("")
        if(isLoading || name===""|| email===""||password==="") return;
        try{
            //1. 계정 생성
            //2. 사용자의 프로필 이름을 설정
            //3. 홈페이지로 리다이렉트
            const credentials=await createUserWithEmailAndPassword(auth,email,password);
            console.log(credentials.user);
            await updateProfile(credentials.user,{
                displayName:name
            })
            navigate("/");
        }catch(e){
            //에러 잡기
            console.log(e);
            if(e instanceof FirebaseError){
                setError(e.message)
            }
        }
        finally{
            setLoading(true);
        }
    }
    return (
        <Wrapper>
            <Title>Join X</Title>
            <Form onSubmit={onSubmit}>
                <Input onChange={onChange} name="name" value={name} placeholder="Name" type="text" required/>
                <Input onChange={onChange} name="email" value={email} placeholder="Email" type="email" required/>
                <Input onChange={onChange} name="password" value={password} placeholder="Password" type="password" required/>
                <Input type="submit" value={isLoading ? "Loading...":"Create Account"} />
            </Form>
            {error !== ""?<Error>{error}</Error>:null}
            <Switcher>
                Already have an account?<Link to="/login">Log in &rarr;</Link>
            </Switcher>
            <GithubButton/>
        </Wrapper>
    )
}