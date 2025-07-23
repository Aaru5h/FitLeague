'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Failed to log out:', error)
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
                <Link href="/workouts" className={styles.link}>
                  Workouts
                </Link>
                <Link href="/challenges" className={styles.link}>
                  Challenges
                </Link>
                <Link href="/leaderboard" className={styles.link}>
                  Leaderboard
                </Link>
                <div className={styles.account}>
                  <span className={styles.name}>
                    {user.displayName || user.email}
                  </span>
                  <button onClick={handleLogout} className={`${styles.btn} ${styles.btnOutline}`}>
                    Logout
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
