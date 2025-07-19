// 'use client'
// import React, { useEffect, useState } from 'react'
// import './styles.css'

// const Leaderboard = () => {

//   const [leaderboardData, setLeaderBoardData] = useState([])
//   const [load,setLoad] = useState(true)

//   useEffect(()=>{
//     const fetchUserLeaderboard = ()=>{

//       setTimeout(()=>{
//         setLoad(true)
//         setLeaderBoardData([
//           { name: 'John Doe', workouts: 12 },
//           { name: 'Jane Smith', workouts: 10 },
//           { name: 'Jim Brown', workouts: 8 },
//         ]);
//         setLoad(false)
//       },1000)
//     }

//     fetchUserLeaderboard()
//   },[])

//   return (
//     <div className="leaderboard-container">
//       <h1 className="leaderboard-title">Leaderboard</h1>

//       {
//         load ? <p className="loading-message">Loading...</p>
//         :
//         (
//           <table className="leaderboard-table">
//             <thead>
//               <tr>
//                 <th>Position</th>
//                 <th>Name</th>
//                 <th>Workouts Completed</th>
//               </tr>
//             </thead>

//             <tbody>
//               {leaderboardData.map((user, index) => (
//                 <tr key={index}>
//                   <td>{index + 1}</td>
//                   <td>{user.name}</td>
//                   <td>{user.workouts}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )
//       }
//     </div>
//   )
// }

// export default Leaderboard
'use client'
import { useEffect, useState } from 'react'

export default function Leaderboard({ participants }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(!participants)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (participants) {
      setActivities(participants)
      return
    }

    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/strava/activities')
        const data = await res.json()
        console.log('Fetched activities:', data)

        if (!Array.isArray(data)) {
          setErrorMsg(data.error || 'Unexpected error')
        } else {
          setActivities(data)
        }
      } catch (err) {
        console.error('Error fetching activities:', err)
        setErrorMsg('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [participants])

  if (loading) return <p>Loading leaderboard</p>
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {activities.map((activity, index) => (
          <li key={activity.id || index}>
            {index + 1}. <strong>{activity.name}</strong> — {(activity.distance / 1000).toFixed(2)} km
          </li>
        ))}
      </ul>
    </div>
  )
}
