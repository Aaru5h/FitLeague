'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { logIn } from '@/services/auth'
import './styles.css'
import { useRouter } from 'next/router'

const Login = () => {

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error, setError] = useState('');

  const handleLogin = async()=>{
    try {
      await logIn(email, password);
      router.push('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  }

  const handleEmail = (e)=>{
    setEmail(e.target.value)
  }

  const handlePassword = (e)=>{
    setPassword(e.target.value)
  }

  return (
    <div className = "login-container">
      <h1 className = "login-header">Log in to your account</h1>
      <input
        type='email'
        placeholder='Enter your email'
        value={email}
        onChange={handleEmail}
        />

      
      <input  
        type='password'
        placeholder='Password'
        value={password}
        onChange={handlePassword}
      />

      {error && <p className="error">{error}</p>}

      <button className = "login-button" onClick={handleLogin}>Login</button>

      <p className='login-footer'>
        If you haven't signed up, click{" "}
      <Link href="signup">
        here
      </Link>
      </p>
    </div>
  )
}

export default Login