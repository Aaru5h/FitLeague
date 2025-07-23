'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    if (isLoggingOut) return // Prevent multiple logout attempts
    
    // Ask for confirmation
    const confirmLogout = window.confirm('Are you sure you want to log out?')
    if (!confirmLogout) return
    
    setIsLoggingOut(true)
    try {
      await logout()
      // Close mobile menu if open
      setIsMenuOpen(false)
      // Redirect to home page after successful logout
      router.push('/')
      // Show success message
      setTimeout(() => {
        alert('Successfully logged out! 👋')
      }, 100)
    } catch (error) {
      console.error('Failed to log out:', error)
      // Show user-friendly error message
      alert('Failed to log out. Please check your internet connection and try again.')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <nav className={styles.navigation}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <Link href="/" className={styles.brand}>
            <span className={styles.icon}>🏋️‍♀️</span>
            FitLeague
          </Link>

          <button
            className={styles.toggle}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`${styles.links} ${isMenuOpen ? styles.linksOpen : ''}`}>
            {user ? (
              <>
                <Link href="/dashboard" className={styles.link}>
                  Dashboard
                </Link>
                <Link href="/workout" className={styles.link}>
                  Workouts
                </Link>
                <Link href="/leaderboard" className={styles.link}>
                  Leaderboard
                </Link>
                <Link href="/profile" className={styles.link}>
                  Profile
                </Link>
                <div className={styles.account}>
                  <span className={styles.name}>
                    {user.displayName || user.email}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    disabled={isLoggingOut}
                    className={`${styles.btn} ${styles.btnOutline}`}
                    style={{ opacity: isLoggingOut ? 0.6 : 1 }}
                  >
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/login" className={`${styles.btn} ${styles.btnOutline}`}>
                  Login
                </Link>
                <Link href="/auth/signup" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
