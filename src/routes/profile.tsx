import styled from "styled-components";
import { auth, storage } from "../firebase";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap:20px
`;

const AvatarUpload=styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    background-color: #1b9bf0;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg{
        width: 50px;
    }
`;

const AvatarImg=styled.img`
    width: 100%;
`;

const AvatarInput=styled.input`
    display: none;
`;

const Name=styled.span`
    font-size:22px;
`;

export default function Profile(){
    const user=auth.currentUser;
    const FILE_SIZE_MAX_LIMIT=1*1024*1024;
    const [avatar, setAvatar]=useState(user?.photoURL);
    const onAvatarChange=async (e:React.ChangeEvent<HTMLInputElement>)=>{
        const {files} =e.target;
        if(files && files.length===1){
            if(files[0].size>FILE_SIZE_MAX_LIMIT){
                alert("The maximum capacity that can be uploaded is 1mb");
                return;
            }
            const file= files[0];
            const locationRef=ref(storage,`avatars/${user?.uid}`);
            const result=await uploadBytes(locationRef,file);
            const avatarUrl=await getDownloadURL(result.ref);
            setAvatar(avatarUrl);
            await updateProfile(user,{
                photoURL:avatarUrl,
            });
        }
    };
    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {Boolean(avatar)? <AvatarImg src={avatar}/>: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
</svg>
}
            </AvatarUpload>
            <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*"/>
            <Name>
                {user?.displayName ?? "Anonymous"}
            </Name>
        </Wrapper>
    );
}