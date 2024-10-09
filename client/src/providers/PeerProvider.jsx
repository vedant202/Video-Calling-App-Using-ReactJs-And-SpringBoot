import React, { useCallback, useEffect, useMemo, useState } from 'react'

export const PeerContext = React.createContext(null)
export const usePeer = ()=>React.useContext(PeerContext);

export default function PeerProvider(props) {
  const [remoteStreams,setRemoteStreams] = useState(null);
  const peer = useMemo(()=>new RTCPeerConnection({
    iceServers:[
      {
        urls:[
          "stun:stun.l.google.com:19302",
          "stun:global.stun.twilio.com:3478"
        ]
      }
    ]
  }),[])

  const createOffer = async()=>{
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  }


  const createAnswer = async(offer)=>{
    await peer.setRemoteDescription(offer);
    const ans=await peer.createAnswer();
    await peer.setLocalDescription(ans);
    return ans;
  }

  const setRemoteAnswer = async(ans)=>{
    await peer.setRemoteDescription(ans);
  }

  const sendStream = async(stream)=>{
    console.log("Sending Streams :- ",stream)
    const tracks = stream.getTracks();
    console.log("Tracks :- ",tracks)

    for(let track of tracks){
      console.log("Adding track ",track)
      peer.addTrack(track,stream);
    }

  }

  // const handleStream = useCallback((ev)=>{
  //   const streams = ev.streams;
  //   console.log("Handling Stream",streams)
  //   setRemoteStreams(streams[0])
  // },[])

  useEffect(()=>{
    const handleStream = async(ev)=>{
      const streams = ev.streams;
      console.log("Handling Stream",streams)
      setRemoteStreams(streams[0])
    };
    console.log("HandleStream Listner")
    peer.addEventListener('track',handleStream);

    return ()=>{
      peer.removeEventListener('track',handleStream);
    }
  },[peer])


  return (
    
      <PeerContext.Provider value={{peer,createOffer,createAnswer,setRemoteAnswer,sendStream,remoteStreams}}>
        {props.children}
      </PeerContext.Provider>
  )
}
