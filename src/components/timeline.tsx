
import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";
export interface ITweet{
    id: string;
    photo?:string;
    tweet:string;
    userId:string;
    username:string;
    createdAt:number;
}

const Wrapper =styled.div`
    display: flex;
    gap: 10px;
    flex-direction:  column;
    overflow-y: scroll;
`;

export default function Timeline(){
    const [tweets, setTweet]=useState<ITweet[]>([]);
    useEffect(()=>{
        let unsubscribe: Unsubscribe|null=null;
        const fetchTweets= async() => {
            const tweetsQuery = query(
                collection(db,"tweets"),
                orderBy("createdAt","desc"),
                limit(25)
            )
            // const snapshot= await getDocs(tweetsQuery);
            // const tweets= snapshot.docs.map((doc) => {
            //     const {tweet, createdAt, userId, username, photo}= doc.data();
            //     return{
            //         tweet,createdAt,userId,username,photo,
            //         id:doc.id
            //     };
            // }); 해당 함수 말고 다른 함수 사용
            //db 및 쿼리와 실시간 연결을 생성. 해당 쿼리에 새 요소가 생성되거나, 요소가 삭제되었거나 또는 업데이트 됐을 때 쿼리에 알려줌
            //하지만 onSnapshot함수는 unsubscribe 반환함
            //예를들어 사용자가 자리를 비우고 별도의 화면으로 이동하면 이벤트 리스너에 대한 구독을 취소해야함 계속 켜놓으면 그만큼 우리가 비용을 지불해야함
            //useEffect 안으로 함수를 다 들여보냄
            //useEffect는 유저가 화면을 보지 않을 떄 값을 반환하면서 cleanup을 실시
            //즉 이 컴포넌트가 안보일때, cleanup이 실행
            //예를들어, 유저가 프로필 페이지로 이동하면 타임라인의 이벤트를 계속 들을 필요가 없기 때문
            unsubscribe= await onSnapshot(tweetsQuery,(snapshot) => {
                const tweets =snapshot.docs.map((doc) => {
                        const {tweet, createdAt, userId, username, photo}= doc.data();
                        return{
                            tweet,createdAt,userId,username,photo,
                            id:doc.id
                        };
                    });
                setTweet(tweets);   
            })
        };
        fetchTweets();
        return () =>{
            unsubscribe && unsubscribe();
        }
    },[])
    return <Wrapper>{tweets.map(tweet => <Tweet key={tweet.id} {...tweet}/>)}</Wrapper>;//단순 결과물을 보기 위함
}