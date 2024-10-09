import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSocket } from '../providers/SocketProvider'
import { usePeer } from '../providers/PeerProvider';
import ReactPlayer from 'react-player';

export default function Room() {
    const {roomId} = useParams()
    const {socket} = useSocket();
    const {peer,createOffer,createAnswer,setRemoteAnswer,sendStream,remoteStreams} = usePeer();
    const [remoteEmaiId,setRemoteEmailId] = useState("")
    const [myStream,setMyStream]= useState(null);

    //Handling new user joined
    const handleUserJoined = useCallback( async(emailId)=>{
        console.log("New User Joined Room",emailId)
        const offer = await createOffer()
        console.log("Offer ",offer)
        socket.emit('call-user',{offer:offer,email:emailId})
        setRemoteEmailId(emailId);
        
    },[createOffer,socket]);

    const handleIncomingCall = useCallback(async(data)=>{
        
        const {fromEmail,offer} = data;
        console.log("Incomming Call :- ",data);
        const ans = await createAnswer(offer);
        console.log("Ans :- ",ans)
        socket.emit("call-accepted",{emailId:fromEmail,answer:ans})
        setRemoteEmailId(fromEmail);
    },[createAnswer,socket])


    const handleCallAccepted = useCallback(async (data)=>{
        const {answer} =data;
        console.log("Call Got Accepted ",answer);
        await setRemoteAnswer(answer);
    },[setRemoteAnswer])


    useEffect(()=>{
        socket.on("user-joined",handleUserJoined)
        socket.on("incomming-call",handleIncomingCall);
        socket.on("call-accepted",handleCallAccepted);

        return ()=>{
            socket.off("user-joined",handleUserJoined);
            socket.off("incomming-call",handleIncomingCall);
            socket.off("call-accepted",handleCallAccepted);
        }
    },[socket,handleIncomingCall,handleUserJoined,handleCallAccepted])

    const getUserMediaStream=useCallback(async ()=>{
        const stream = await navigator.mediaDevices.getUserMedia({audio:true,video:true});
        setMyStream(stream);
    },[])

    useEffect(()=>{
        console.log("Getting User Media Streams");
        getUserMediaStream();
    },[getUserMediaStream])

    const handleNegotiation = useCallback( async (currentRemoteEmailId)=>{
        // const localOffer = peer.localDescription;
        // console.log("handling Negotiation ",{localOffer,currentRemoteEmailId});
        // socket.emit('call-user',{offer:localOffer,email:currentRemoteEmailId});

        const localOffer = await createOffer();
        console.log("handling Negotiation ",{localOffer,currentRemoteEmailId});
        socket.emit('call-user',{offer:localOffer,email:currentRemoteEmailId})
    },[peer.localDescription,remoteEmaiId,socket])

    
    useEffect(()=>{
        console.log("Remote EmailId :- ",remoteEmaiId)
        const negotiation = ()=>handleNegotiation(remoteEmaiId);
        peer.addEventListener("negotiationneeded",negotiation);

        return ()=>{
            peer.removeEventListener("negotiationneeded",negotiation)
        }
    },[remoteEmaiId,handleNegotiation])

    

    console.log("Remot Streams :- ",remoteStreams)
  return (
    <>
    <div>Room: {roomId}</div>
    <div>Your are Connected to {remoteEmaiId}</div>
    <button onClick={(ev)=>sendStream(myStream)}>Send My Video</button>
    <ReactPlayer url={myStream} playing muted/>
    <ReactPlayer url={remoteStreams} playing/>
    </>
  )
}
