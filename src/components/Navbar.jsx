'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className={styles.nav}>
      <div className="container">
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>🏋️‍♀️</span>
            FitLeague
          </Link>

          {/* Mobile menu button */}
          <button
            className={styles.menuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Navigation links */}
          <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
            {user ? (
              <>
                <Link href="/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
                <Link href="/workouts" className={styles.navLink}>
                  Workouts
                </Link>
                <Link href="/challenges" className={styles.navLink}>
                  Challenges
                </Link>
                <Link href="/leaderboard" className={styles.navLink}>
                  Leaderboard
                </Link>
                <div className={styles.userMenu}>
                  <span className={styles.userName}>
                    {user.displayName || user.email}
                  </span>
                  <button onClick={handleLogout} className="btn btn-outline">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link href="/signup" className="btn btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
