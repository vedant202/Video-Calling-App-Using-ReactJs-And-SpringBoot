import React, { useMemo } from 'react'
import io from 'socket.io-client'
const SocketContext = React.createContext(null)

export const useSocket = ()=>{
  return React.useContext(SocketContext);
}

export default function SocketProvider(props) {

    const socket = useMemo(()=>io("http://192.168.1.41:8081"),[])

  return (
    <SocketContext.Provider value={{socket}}>
        {props.children}
    </SocketContext.Provider>
  )
}
