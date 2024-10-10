import React, { useCallback, useEffect, useRef, useState } from 'react'
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
    const [chatMessage,setChatMessage] = useState("");
    const displayMessageBlockRef = useRef();
    const [displayMessages, setDisplayMessages] = useState([])

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

    

    // console.log("Remot Streams :- ",remoteStreams)

    const handleIncommingChatMessage = useCallback((data)=>{
        const {message} =data;
        console.log("Incomming Message :- ",message)
        const msgHtml=<div className=' border border-2 w-full text-right'>{message}</div>;
        setDisplayMessages(prev=>[...prev,msgHtml]);

    },[])

    useEffect(()=>{
        socket.on("send:out:message",handleIncommingChatMessage);

        return ()=>{
            socket.off("send:out:message",handleIncommingChatMessage);
        }
    },[handleIncommingChatMessage])


    const handleSentMessage = (remoteEmaiId)=>{
        console.log(chatMessage,remoteEmaiId);
        const msgHtml=<div className=' border border-2 w-full text-left'>{chatMessage}</div>;
        setDisplayMessages(prev=>[...prev,msgHtml]);
        if(remoteEmaiId!==""){
            socket.emit('send:incom:message',{toEmail:remoteEmaiId,message:chatMessage})
        }
        
    }

    

  return (
    <>
    <div className="text-center">Room: {roomId}</div>

    <div className="text-center"> {remoteEmaiId?`Your are Connected to ${remoteEmaiId}`:"No one in room"}</div>
    <button onClick={(ev)=>sendStream(myStream)}>Send My Video</button>
    <div className='flex mr-2'>
        <div className='flex flex-wrap w-[70%] justify-space-around items-center'>
            <div>
                {myStream && <ReactPlayer url={myStream} playing muted/>}
            </div>
            <div>
                {remoteStreams && <ReactPlayer url={remoteStreams} playing/>}
            </div>
        </div>
        <div className='border p-2 border-2 w-[30%]'>
            <h3 className='text-2xl text-center'>Chat With Users</h3>
            <div ref={displayMessageBlockRef} className='flex flex-col bg-slate-200 p-2 h-[400px]'>
                {displayMessages.map(i=>i)}
            </div>
            <div className='  '>
                <div className='w-full'>
                    <input
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="john.doe@company.com"
                    value={chatMessage}
                    onChange={(e)=>setChatMessage(e.target.value)}
                    required
                    />
                    <button className="border w-full p-2 m-2 bg-cyan-400 text-white-500" onClick={()=>handleSentMessage(remoteEmaiId)}>Send Message</button>
                </div>
            </div>
        </div>
    </div>
    </>
  )
}
