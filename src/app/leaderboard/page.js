'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getStravaActivities, getAthleteInfo, getStravaAuthUrl } from '@/services/strava'
import styles from './styles.css'

export default function LeaderboardPage() {
  const [loading, setLoading] = useState(true)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [currentUserRank, setCurrentUserRank] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedCategory, setSelectedCategory] = useState('overall')
  const [stravaConnected, setStravaConnected] = useState(false)
  const [stravaToken, setStravaToken] = useState(null)
  const [userActivities, setUserActivities] = useState([])
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    initializeLeaderboard()
  }, [user, router])

  useEffect(() => {
    if (stravaConnected && stravaToken) {
      loadStravaData()
    } else {
      generateMockLeaderboard()
    }
  }, [stravaConnected, stravaToken, selectedPeriod, selectedCategory])

  const initializeLeaderboard = async () => {
    setLoading(true)
    
    // Check if user has connected Strava
    const savedToken = localStorage.getItem('strava_access_token')
    if (savedToken) {
      try {
        // Verify token is still valid by making a simple API call
        const athlete = await getAthleteInfo(savedToken)
        setStravaConnected(true)
        setStravaToken(savedToken)
      } catch (error) {
        console.error('Strava token expired or invalid:', error)
        localStorage.removeItem('strava_access_token')
        localStorage.removeItem('strava_refresh_token')
        setStravaConnected(false)
      }
    }
    
    setLoading(false)
  }

  const loadStravaData = async () => {
    if (!stravaToken) return
    
    try {
      // Fetch user's recent activities
      const activities = await getStravaActivities(stravaToken, 1, 50)
      setUserActivities(activities)
      
      // Calculate user's stats based on selected period
      const userStats = calculateUserStats(activities, selectedPeriod, selectedCategory)
      
      // Generate leaderboard with real Strava data + mock competitors
      const leaderboard = generateLeaderboardWithStravaData(userStats, activities)
      setLeaderboardData(leaderboard)
      
      // Find current user's rank
      const userRank = leaderboard.findIndex(entry => entry.isCurrentUser) + 1
      setCurrentUserRank(userRank > 0 ? userRank : null)
      
    } catch (error) {
      console.error('Error loading Strava data:', error)
      // Fallback to mock data
      generateMockLeaderboard()
    }
  }

  const generateMockLeaderboard = () => {
    const mockData = [
      {
        id: 'user1',
        name: 'Alex Rodriguez',
        avatar: '🏃‍♂️',
        points: 2450,
        activities: 15,
        streak: 12,
        totalDistance: 156.8,
        totalTime: '18h 23m',
        badge: 'gold'
      },
      {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: '🚴‍♀️',
        points: 2380,
        activities: 18,
        streak: 9,
        totalDistance: 142.3,
        totalTime: '16h 45m',
        badge: 'silver'
      },
      {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'You',
        avatar: '💪',
        points: 1850,
        activities: 12,
        streak: 7,
        totalDistance: 98.5,
        totalTime: '12h 15m',
        isCurrentUser: true,
        badge: 'bronze'
      },
      {
        id: 'user4',
        name: 'Mike Chen',
        avatar: '🏋️‍♂️',
        points: 1720,
        activities: 10,
        streak: 5,
        totalDistance: 87.2,
        totalTime: '11h 30m'
      },
      {
        id: 'user5',
        name: 'Emma Wilson',
        avatar: '🏊‍♀️',
        points: 1650,
        activities: 14,
        streak: 8,
        totalDistance: 78.9,
        totalTime: '10h 45m'
      }
    ]

    setLeaderboardData(mockData)
    const userRank = mockData.findIndex(entry => entry.isCurrentUser) + 1
    setCurrentUserRank(userRank)
  }

  const calculateUserStats = (activities, period, category) => {
    // Filter activities based on selected period
    const now = new Date()
    let startDate
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(0) // All time
    }

    const filteredActivities = activities.filter(activity => 
      new Date(activity.start_date) >= startDate
    )

    // Filter by category
    let categoryActivities = filteredActivities
    if (category !== 'overall') {
      categoryActivities = filteredActivities.filter(activity => {
        switch (category) {
          case 'running':
            return activity.type === 'Run'
          case 'cycling':
            return activity.type === 'Ride'
          case 'swimming':
            return activity.type === 'Swim'
          default:
            return true
        }
      })
    }

    // Calculate stats
    const totalDistance = categoryActivities.reduce((sum, activity) => sum + (activity.distance || 0), 0) / 1000 // Convert to km
    const totalTime = categoryActivities.reduce((sum, activity) => sum + (activity.moving_time || 0), 0)
    const points = calculatePoints(categoryActivities)
    const streak = calculateStreak(activities)

    return {
      activities: categoryActivities.length,
      totalDistance: Math.round(totalDistance * 10) / 10,
      totalTime: formatTime(totalTime),
      points,
      streak
    }
  }

  const calculatePoints = (activities) => {
    return activities.reduce((total, activity) => {
      let points = 0
      
      // Base points for completing activity
      points += 50
      
      // Distance-based points
      const km = (activity.distance || 0) / 1000
      points += Math.floor(km * 10)
      
      // Time-based points
      const hours = (activity.moving_time || 0) / 3600
      points += Math.floor(hours * 20)
      
      // Activity type multiplier
      switch (activity.type) {
        case 'Run':
          points *= 1.2
          break
        case 'Ride':
          points *= 1.0
          break
        case 'Swim':
          points *= 1.5
          break
        default:
          points *= 1.1
      }
      
      return total + Math.floor(points)
    }, 0)
  }

  const calculateStreak = (activities) => {
    // Simple streak calculation - days with activities
    const today = new Date()
    let streak = 0
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)
      const hasActivity = activities.some(activity => {
        const activityDate = new Date(activity.start_date)
        return activityDate.toDateString() === checkDate.toDateString()
      })
      
      if (hasActivity) {
        streak++
      } else if (i > 0) {
        break
      }
    }
    
    return streak
  }

  const generateLeaderboardWithStravaData = (userStats, activities) => {
    // Create current user entry with real Strava data
    const currentUserEntry = {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'You',
      avatar: '💪',
      points: userStats.points,
      activities: userStats.activities,
      streak: userStats.streak,
      totalDistance: userStats.totalDistance,
      totalTime: userStats.totalTime,
      isCurrentUser: true
    }

    // Generate some mock competitors with slightly different stats
    const mockCompetitors = [
      {
        id: 'comp1',
        name: 'Alex Rodriguez',
        avatar: '🏃‍♂️',
        points: Math.max(userStats.points + 200, 1500),
        activities: userStats.activities + 3,
        streak: Math.max(userStats.streak + 2, 5),
        totalDistance: userStats.totalDistance + 25.5,
        totalTime: userStats.totalTime,
        badge: 'gold'
      },
      {
        id: 'comp2',
        name: 'Sarah Johnson',
        avatar: '🚴‍♀️',
        points: Math.max(userStats.points + 100, 1200),
        activities: userStats.activities + 2,
        streak: Math.max(userStats.streak + 1, 4),
        totalDistance: userStats.totalDistance + 15.2,
        totalTime: userStats.totalTime,
        badge: 'silver'
      },
      {
        id: 'comp3',
        name: 'Mike Chen',
        avatar: '🏋️‍♂️',
        points: Math.max(userStats.points - 50, 800),
        activities: Math.max(userStats.activities - 1, 3),
        streak: Math.max(userStats.streak - 1, 2),
        totalDistance: Math.max(userStats.totalDistance - 10.5, 20),
        totalTime: userStats.totalTime
      }
    ]

    // Combine and sort by points
    const allEntries = [currentUserEntry, ...mockCompetitors]
    allEntries.sort((a, b) => b.points - a.points)

    // Add badges for top 3
    if (allEntries.length > 0 && !allEntries[0].badge) allEntries[0].badge = 'gold'
    if (allEntries.length > 1 && !allEntries[1].badge) allEntries[1].badge = 'silver'
    if (allEntries.length > 2 && !allEntries[2].badge) allEntries[2].badge = 'bronze'

    return allEntries
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const handleConnectStrava = () => {
    if (typeof window !== 'undefined') {
      window.location.href = getStravaAuthUrl()
    }
  }

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case 'gold':
        return '🥇'
      case 'silver':
        return '🥈'
      case 'bronze':
        return '🥉'
      default:
        return ''
    }
  }

  const getRankSuffix = (rank) => {
    const lastDigit = rank % 10
    const lastTwoDigits = rank % 100
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return 'th'
    }
    
    switch (lastDigit) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

    if (loading) {
    return (
      <div className="leaderboard-page">
        <main className="leaderboard-main">
          <div className="container">
            <div className="loading-wrapper">
              <div className="loading-spinner"></div>
              <p>Loading leaderboard</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>      
      <main>
        <div className="container">
          <div className="leaderboard-header">
            <h1 className="leaderboard-title">🏆 Leaderboard</h1>
            <p className="leaderboard-subtitle">
              Compete with fellow athletes and track your fitness progress
            </p>
          </div>

          {!stravaConnected && (
            <div className="strava-prompt">
              <div className="strava-prompt-card">
                <div className="strava-icon">🔥</div>
                <h3>Connect Strava for Real Rankings</h3>
                <p>
                  Connect your Strava account to see real leaderboard rankings based on your actual activities and compete with other connected athletes.
                </p>
                <button onClick={handleConnectStrava} className="btn btn-primary">
                  Connect Strava Account
                </button>
                <p className="mock-note">
                  <em>Currently showing demo data. Connect Strava for real rankings!</em>
                </p>
              </div>
            </div>
          )}

          {currentUserRank && (
            <div className="user-rank-card">
              <div className="user-rank">
                <span className="rank-number">#{currentUserRank}</span>
                <div className="rank-info">
                  <h3>Your Current Rank</h3>
                  <p>{currentUserRank}{getRankSuffix(currentUserRank)} place {stravaConnected ? 'with Strava data' : 'in demo mode'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="leaderboard-controls">
            <div className="leaderboard-filters">
              <div className="filter-group">
                <label htmlFor="period">Time Period:</label>
                <select 
                  id="period"
                  value={selectedPeriod} 
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="filter-select"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="category">Category:</label>
                <select 
                  id="category"
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="filter-select"
                >
                  <option value="overall">Overall</option>
                  <option value="running">Running</option>
                  <option value="cycling">Cycling</option>
                  <option value="swimming">Swimming</option>
                </select>
              </div>
            </div>
          </div>

          <div className="leaderboard-section">
            <div className="leaderboard-section-header">
              <h2>Rankings - {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} · {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
            </div>

            <div className="leaderboard-list">
              {leaderboardData.map((entry, index) => (
                <div 
                  key={entry.id} 
                  className={`leaderboard-item ${entry.isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className="leaderboard-rank">
                    <span className="rank-number">{index + 1}</span>
                    {entry.badge && <span className="rank-badge">{getBadgeIcon(entry.badge)}</span>}
                  </div>
                  
                  <div className="athlete-info-block">
                    <div className="athlete-avatar">{entry.avatar}</div>
                    <div className="athlete-meta">
                      <h3 className="athlete-name">
                        {entry.name}
                        {entry.isCurrentUser && <span className="you-label">(You)</span>}
                      </h3>
                      <div className="athlete-stats">
                        <span>{entry.activities} activities</span>
                        <span>•</span>
                        <span>{entry.streak} day streak</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="stat-block">
                    <div className="stat-box">
                      <div className="stat-value">{entry.points.toLocaleString()}</div>
                      <div className="stat-label">Points</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-value">{entry.totalDistance} km</div>
                      <div className="stat-label">Distance</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-value">{entry.totalTime}</div>
                      <div className="stat-label">Time</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {stravaConnected && userActivities.length > 0 && (
            <div className="recent-activities-section">
              <h2 className="section-title">Recent Activities</h2>
              <div className="recent-activities-list">
                {userActivities.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="activity-card">
                    <div className="activity-icon">
                      {activity.type === 'Run' ? '🏃‍♂️' : 
                       activity.type === 'Ride' ? '🚴‍♂️' : 
                       activity.type === 'Swim' ? '🏊‍♂️' : '💪'}
                    </div>
                    <div className="activity-details">
                      <h4>{activity.name}</h4>
                      <div className="activity-meta">
                        <span>{((activity.distance || 0) / 1000).toFixed(1)} km</span>
                        <span>•</span>
                        <span>{formatTime(activity.moving_time || 0)}</span>
                        <span>•</span>
                        <span>{new Date(activity.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="activity-points">
                      +{calculatePoints([activity])} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
