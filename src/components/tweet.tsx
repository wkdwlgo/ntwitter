import { ITweet } from "./timeline";
import styled from "styled-components";
const Wrapper=styled.div`
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 20px;
    border:1px solid rgba(255,255,255,0.5);
    border-radius: 15px;
`;

const Column=styled.div`

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
export default function Tweet({username, photo, tweet}:ITweet){
    return(
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                <Payload>{tweet}</Payload>
            </Column>
            <Column>
            {photo ? <Photo src={photo}/>:null}
            </Column>
        </Wrapper>
    )
}