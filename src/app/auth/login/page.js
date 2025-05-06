import Link from 'next/link'
import React from 'react'
import './styles.css'

const Login = () => {
  return (
    <div className = "login-container">
      <h1 className = "login-header">Log in to your account</h1>
      <input
        type='email'
        placeholder='Enter your email'
        />

      
      <input  
        type='password'
        placeholder='Password'
      />

      <button className = "login-button">Login</button>

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