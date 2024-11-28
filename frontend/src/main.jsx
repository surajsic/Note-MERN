import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from "./pages/Home/Home.jsx"
import Login from "./pages/Login/Login.jsx"
import SignUp from "./pages/SignUp/SignUp.jsx"



const router = createBrowserRouter([
  
  {
    path:"/dashboard",
    element:<Home />
  },
  {
    path:"/",
    element:<Login />
  },
  {
    path:"/signup",
    element: <SignUp />
  },
])

createRoot(document.getElementById('root')).render(  
   
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
