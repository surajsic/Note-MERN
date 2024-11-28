import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import { Link, useNavigate } from 'react-router-dom'
import Password from '../../components/input/Password'
import { validEmail } from '../../utils/Helper'
import axiosInstance from '../../utils/axiosInstance'

function Login() {

  const [email, setEmail]= useState("")
  const [password, setPassword]= useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  const handleLogin =async (e)=>{
    e.preventDefault();

    if (!validEmail(email)) {
      setError("Please enter a valid Email Address!")
      return; 
    }

    if (!password) {
      setError("Please enter the password")
      return; 
    }

    setError("");

    //Login API CALL
    
    try {
      const response = await axiosInstance.post("http://localhost:8000/api/auth/login", {
        email:email,
        password:password,

        /* Alternate method 
       const response = await fetch("http://localhost:8000/api/auth/login", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body:JSON.stringify({email:email,
          password:password}),
      })
 */
      })
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else{
        setError("An unexpected Error occured. Please try again!")
      }
    }  
    
  }

  return (<>
    <Navbar />
    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleLogin}>
          <h4 className='text-2xl mb-7'>Login</h4>

          <input type='text' placeholder='Email' className='input-box' value={email} onChange={(e) => setEmail(e.target.value)}/>

          <Password value={password} onChange={(e)=>setPassword(e.target.value)}/>

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

          <button type='submit' className='btn-primary'>Login</button>

          <p className='text-sm text-center mt-4'>
            Not Registered yet?{""}
          <Link to="/signup" className="font-medium text-primary underline">Create an Account</Link>
          </p>
        </form>
      </div>
    </div>
        </>
  )
}

export default Login
