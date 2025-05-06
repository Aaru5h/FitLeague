'use client'
import React, { useEffect, useState } from 'react'
import './styles.css'

const Leaderboard = () => {

  const [leaderboardData, setLeaderBoardData] = useState([])
  const [load,setLoad] = useState(true)

  useEffect(()=>{
    const fetchUserLeaderboard = ()=>{

      setTimeout(()=>{
        setLoad(true)
        setLeaderBoardData([
          { name: 'John Doe', workouts: 12 },
          { name: 'Jane Smith', workouts: 10 },
          { name: 'Jim Brown', workouts: 8 },
        ]);
        setLoad(false)
      },1000)
    }

    fetchUserLeaderboard()
  },[])

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>

      {
        load ? <p className="loading-message">Loading...</p>
        :
        (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Name</th>
                <th>Workouts Completed</th>
              </tr>
            </thead>

            <tbody>
              {leaderboardData.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.workouts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      }
    </div>
  )
}

export default Leaderboard