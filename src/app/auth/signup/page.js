import React from 'react'
import Link from 'next/link'
import './styles.css'

const Signup = () => {
  return (
    <div className="signup-container">
      <h2 className="signup-heading">Sign Up</h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="email-input"
      />

      <input
        type="password"
        placeholder="Password"
        className="password-input"
      />

      <button className="signup-button">Sign up</button>

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
