import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Password from '../../components/input/Password'
import { Link, useNavigate } from 'react-router-dom'
import { validEmail } from '../../utils/Helper'
import axiosInstance from '../../utils/axiosInstance'


function SignUp() {

  const[name, setName] = useState("")
  const [email, setEmail]= useState("")
  const [password, setPassword]= useState("")
  const [error, setError] = useState(null)

  const navigate = useNavigate();

  const handleSignUp = async (e)=>{
    e.preventDefault();
      if (!name) {
        setError("Please Enter your name")
        return;
      }

      if (!validEmail(email)) {
        setError("Please Enter a Valid Email Address~!")
        return;
      }

      if (!password) {
        setError("Invalid Password")
        return;
      }

      setError("");

      //SignUp API CALL
      try {
        const response = await axiosInstance.post("http://localhost:8000/api/auth/create-account", {
          fullName:name,
          email:email,
          password:password,
          })
        if (response.data && response.data.error) {
          setError(response.data.message)
          return
        }

        if (response.data && response.data.accessToken) {
          localStorage.setItem("token", response.data.accessToken)
          navigate("/dashboard")
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
  return (
    <>
      <Navbar />
    <div className='flex items-center justify-center mt-28'>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form onSubmit={handleSignUp}>
          <h4 className='text-2xl mb-7'>SignUp</h4>

          <input type='text' placeholder='Name' className='input-box' 
          value={name} onChange={(e) => setName(e.target.value)}
          />

          <input type='text' placeholder='Email' className='input-box' 
          value={email} onChange={(e) => setEmail(e.target.value)}
          />

          <Password value={password} onChange={(e)=>setPassword(e.target.value)}/>

          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

        <button type='submit' className='btn-primary'>Create Account</button>

          <p className='text-sm text-center mt-4'>
            Already Have An Account?{" "}
          <Link to="/" className="font-medium text-primary underline">Login</Link>
          </p>

          </form>
      </div>
    </div>
          </>
  )
}

export default SignUp
