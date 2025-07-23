'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import './dashboard.css'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({
    workoutsCompleted: 42,
    totalPoints: 1250,
    currentStreak: 7,
    weeklyGoal: 5
  })

  useEffect(() => {
    // Mock user data - replace with actual auth context
    setUser({
      name: 'John Doe',
      email: 'john@example.com',
      avatar: '/api/placeholder/100/100'
    })
  }, [])

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <div className="welcomeSection">
          <h1 className="welcomeTitle">Welcome back, {user?.name || 'User'}!</h1>
          <p className="welcomeSubtitle">Ready to crush your fitness goals today?</p>
        </div>
        <div className="userAvatar">
          <img src={user?.avatar || '/api/placeholder/60/60'} alt="Profile" />
        </div>
      </div>

      <div className="statsGrid">
        <div className="statCard">
          <div className="statIcon">💪</div>
          <div className="statContent">
            <h3 className="statNumber">{stats.workoutsCompleted}</h3>
            <p className="statLabel">Workouts Completed</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon">⭐</div>
          <div className="statContent">
            <h3 className="statNumber">{stats.totalPoints}</h3>
            <p className="statLabel">Total Points</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon">🔥</div>
          <div className="statContent">
            <h3 className="statNumber">{stats.currentStreak}</h3>
            <p className="statLabel">Day Streak</p>
          </div>
        </div>
        <div className="statCard">
          <div className="statIcon">🎯</div>
          <div className="statContent">
            <h3 className="statNumber">{stats.weeklyGoal}</h3>
            <p className="statLabel">Weekly Goal</p>
          </div>
        </div>
      </div>

      <div className="quickActions">
        <h2 className="sectionTitle">Quick Actions</h2>
        <div className="actionGrid">
          <Link href="/workout" className="actionCard">
            <div className="actionIcon">🏋️</div>
            <h3 className="actionTitle">Browse Workouts</h3>
            <p className="actionDescription">Find your next workout routine</p>
          </Link>
          <Link href="/leaderboard" className="actionCard">
            <div className="actionIcon">🏆</div>
            <h3 className="actionTitle">View Leaderboard</h3>
            <p className="actionDescription">See how you rank against others</p>
          </Link>
          <div className="actionCard">
            <div className="actionIcon">📱</div>
            <h3 className="actionTitle">Connect Strava</h3>
            <p className="actionDescription">Sync your activities automatically</p>
          </div>
          <div className="actionCard">
            <div className="actionIcon">📊</div>
            <h3 className="actionTitle">View Progress</h3>
            <p className="actionDescription">Track your fitness journey</p>
          </div>
        </div>
      </div>

      <div className="recentActivity">
        <h2 className="sectionTitle">Recent Activity</h2>
        <div className="activityList">
          <div className="activityItem">
            <div className="activityIcon">🏃</div>
            <div className="activityContent">
              <h4 className="activityTitle">Morning Run</h4>
              <p className="activityDetails">5.2 km • 25 min • +50 points</p>
              <span className="activityTime">2 hours ago</span>
            </div>
          </div>
          <div className="activityItem">
            <div className="activityIcon">💪</div>
            <div className="activityContent">
              <h4 className="activityTitle">Strength Training</h4>
              <p className="activityDetails">Upper Body • 45 min • +75 points</p>
              <span className="activityTime">Yesterday</span>
            </div>
          </div>
          <div className="activityItem">
            <div className="activityIcon">🚴</div>
            <div className="activityContent">
              <h4 className="activityTitle">Cycling</h4>
              <p className="activityDetails">15.3 km • 42 min • +65 points</p>
              <span className="activityTime">2 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
