'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useStrava } from '@/context/StravaContext'
import './dashboard.css'

export default function Dashboard() {
  const { user, loading } = useAuth()
  const { isConnected, connectToStrava, disconnectFromStrava, athleteData, handleStravaCallback } = useStrava()
  const [stats, setStats] = useState({
    workoutsCompleted: 40,
    totalPoints: 1250,
    currentStreak: 7,
    weeklyGoal: 5
  })
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    // Handle Strava callback
    const stravaSuccess = searchParams.get('strava_success')
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')
    const athleteId = searchParams.get('athlete_id')
    const stravaError = searchParams.get('strava_error')

    if (stravaSuccess && accessToken && refreshToken) {
      handleStravaCallback(accessToken, refreshToken, { id: athleteId })
      // Clean up URL
      router.replace('/dashboard')
      alert('Successfully connected to Strava! 🎉')
    } else if (stravaError) {
      let errorMessage = 'Failed to connect to Strava.'
      switch (stravaError) {
        case 'access_denied':
          errorMessage = 'Strava access was denied.'
          break
        case 'no_code':
          errorMessage = 'No authorization code received from Strava.'
          break
        case 'token_exchange_failed':
          errorMessage = 'Failed to exchange authorization code for access token.'
          break
        default:
          errorMessage = 'An error occurred while connecting to Strava.'
      }
      alert(errorMessage)
      // Clean up URL
      router.replace('/dashboard')
    }
  }, [searchParams, handleStravaCallback, router])

  return (
    <div className="dashboardContainer">
      <div className="dashboardHeader">
        <div className="welcomeSection">
          <h1 className="welcomeTitle">Welcome, {user?.displayName || user?.email || 'User'}!</h1>
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
          <div 
            className={`actionCard ${isConnected ? 'connected' : 'clickable'}`}
            onClick={isConnected ? disconnectFromStrava : connectToStrava}
            style={{ cursor: 'pointer' }}
          >
            <div className="actionIcon">{isConnected ? '✅' : '📱'}</div>
            <h3 className="actionTitle">{isConnected ? 'Strava Connected' : 'Connect Strava'}</h3>
            <p className="actionDescription">
              {isConnected 
                ? `Connected as ${athleteData?.firstname || 'Athlete'} • Click to disconnect`
                : 'Sync your activities automatically'
              }
            </p>
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
