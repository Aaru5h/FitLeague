// 'use client'
// import Link from 'next/link'
// import React, { useState } from 'react'
// import styles from './Navbar.module.css'

// const Navbar = () => {
//   // const [login, setLogin] = useState(false)

//   return (
//     <div className={styles.navbar}>
//       <div className={styles.navLinks}>
//         <Link href="/">Home</Link>
//         <Link href="/workout">Workout Generator</Link>
//         <Link href="/leaderboard">Leaderboard</Link>
//         <Link href='/profile'>Profile</Link>
//         <Link href='/about'>About Us</Link>
//       </div>
//       <Link href='/auth/login'>
//         <button className={styles.authButton}>
//           {/* {login ? 'Log Out' : 'Log In'} */}
//           Login
//         </button>
//       </Link>
//     </div>
//   )
// }

// export default Navbar



'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import styles from './Navbar.module.css'
import { AuthContext } from '@/context/AuthContext'
import { logOut } from '@/services/auth'
import { useRouter } from 'next/navigation'

const Navbar = () => {
  const { user } = useContext(AuthContext)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logOut()
      router.push('/auth/login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.navLinks}>
        <Link href="/">Home</Link>
        <Link href="/workout">Workout Generator</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/about">About Us</Link>
      </div>

      {user ? (
        <button className={styles.authButton} onClick={handleLogout}>
          Log Out
        </button>
      ) : (
        <Link href="/auth/login">
          <button className={styles.authButton}>Log In</button>
        </Link>
      )}
    </div>
  )
}

export default Navbar
