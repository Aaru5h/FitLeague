// 'use client'
// import React, { useEffect, useState } from 'react'
// import './styles.css'

// const Profile = () => {

//     const [user, setUser] = useState({
//         name: 'John Doe',
//         email: 'john@gmail.com',
//         totalWorkouts: 12,
//     })

//     useEffect(()=>{
//         setTimeout(()=>{
//             setUser({
//                 name: 'John Doe',
//                 email: 'john@gmail.com',
//                 totalWorkouts: 12,
//             })
//         },1000)
//     },[])

//   return (
//     <div className="profile-container">
//         <h1>User Profile</h1>
//         <ul>
//                 <li>Name: {user.name}</li>
//                 <li>Email: {user.email}</li>
//                 <li>Total number of workouts: {user.totalWorkouts}</li>
//         </ul>

//         <button>Log out</button>
//         <button>Edit Profile</button>
//     </div>
//   )
// }

// export default Profile

'use client'
import React from 'react'
import { useAuth } from '@/context/AuthContext'

const Profile = () => {
    const {user, loading} = useAuth()

    if (loading) {
    return <p>Loading user</p>
  }

    if (!user){
        return <p>Sign up or Log in to your account to view the profile</p>
    }
  return (
    <div>
        <h1>User Profile</h1>

        <ul>
            <li>Name: {user.displayName}</li>
            <li>Email: {user.email}</li>
            <li>UID: {user.uid}</li>
            {/* <li>Total Workouts: {user.totalWorkouts}</li> */}
        </ul>
    </div>
  )
}

export default Profile