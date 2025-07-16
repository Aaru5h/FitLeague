'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/services/auth'
import './styles.css'
import { useRouter } from 'next/router'

const Signup = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error,setError] = useState('')

  const handleSignUp = async()=>{
    try {
      await signUp(email, password);
      router.push('/')
    } catch (err) {
      console.error('Signup error:', err)
    }
  }

  const handleEmail = (e)=>{
    setEmail(e.target.value)
  }

  const handlePassword = (e)=>{
    setPassword(e.target.value)
  }

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="email-input"
        value={email}
        onChange={handleEmail}
      />

      <input
        type="password"
        placeholder="Password"
        className="password-input"
        value={password}
        onChange={handlePassword}
      />

      {error && <p className="error-message">{error}</p>}

      <button className="signup-button" onClick={handleSignUp}>Sign up</button>

      <p className="signup-footer">
        If you already have an account, click{" "}
        <Link href="login" className="login-link">
          here
        </Link>
      </p>
    </div>
  )
}

export default Signup
