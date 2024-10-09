import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import HomePage from './pages/HomePage'
import Socket from './providers/SocketProvider'
import SocketProvider from './providers/SocketProvider'
import Room from './pages/Room'
import PeerProvider from './providers/PeerProvider'

function App() {

const router = createBrowserRouter([
  {
    path:"/",
    element:<HomePage />
  },
  {
    path:"/room/:roomId",
    element:<Room />
  }
])

  return (
    <>
      <SocketProvider>
        <PeerProvider>
          <RouterProvider router={router} />
        </PeerProvider>
      </SocketProvider>
    </>
  )
}

export default App
