import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [roomNo, setRoomno] = useState();
  const { socket } = useSocket();
  const navigate = useNavigate();

  const handleJoindeRoom =  useCallback((data) => {
    console.log(data);
    navigate(`/room/${data}`)
  },[navigate]);

  useEffect(() => {
    socket.on("joined-room",handleJoindeRoom);
    
    return ()=>{
      socket.off("joined-room",handleJoindeRoom)
    }
  }, [handleJoindeRoom,socket]);

  const handleSubmit = () => {
    console.log({ email: email, roomId: roomNo });
    socket.emit("join-room", { email: email, roomId: roomNo });
    
  };

  return (
    <div className="  w-[100%] h-[100vh] flex justify-center flex-col items-center">
      <h1 className="text-5xl font-bold mb-[20px]">Video Conferencing App</h1>
      <div className="w-[50%] border p-[30px] flex flex-col">
        <div className="m-[10px]">
          <label
            for="email"
            className="block mb-2 text-lg text-gray-900 dark:text-white"
          >
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="john.doe@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="m-[10px]">
          <label
            for="roomNo"
            className="block mb-2 text-lg text-gray-900 dark:text-white"
          >
            Romm No
          </label>
          <input
            type="text"
            id="roomNo"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="123..."
            value={roomNo}
            onChange={(e) => setRoomno(e.target.value)}
            required
          />
        </div>
        <div className="m-[10px]">
        <button
          type="click"
          onClick={handleSubmit}
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
        </div>
      </div>
    </div>
  );
}
