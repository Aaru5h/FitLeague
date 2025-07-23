'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useStrava } from '@/context/StravaContext'
import './profile.css'

const Profile = () => {
  const { user, loading, logout } = useAuth()
  const { isConnected, connectToStrava, disconnectFromStrava, athleteData } = useStrava()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState({
    displayName: '',
    bio: '',
    fitnessGoals: ''
  })
  const [userStats, setUserStats] = useState({
    totalWorkouts: 40,
    totalPoints: 1250,
    currentStreak: 7,
    workoutsThisWeek: 4,
    favoriteCategory: 'Full Body',
    joinDate: 'January 2024'
  })
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
      return
    }
    
    if (user) {
      setEditedProfile({
        displayName: user.displayName || '',
        bio: 'Fitness enthusiast working towards a healthier lifestyle! 💪',
        fitnessGoals: 'Build strength, improve endurance, and maintain consistency'
      })
    }
  }, [user, loading, router])

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSaveProfile = () => {
    // Here you would typically save to Firebase/database
    console.log('Saving profile:', editedProfile)
    setIsEditing(false)
    alert('Profile updated successfully! 🎉')
  }

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleLogout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to log out?')
    if (confirmLogout) {
      try {
        await logout()
        router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-wrapper">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="auth-required">
          <div className="auth-icon">🔐</div>
          <h2>Authentication Required</h2>
          <p>Please sign up or log in to view your profile</p>
          <div className="auth-buttons">
            <Link href="/auth/login" className="btn btn-primary">Login</Link>
            <Link href="/auth/signup" className="btn btn-outline">Sign Up</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-picture-section">
            <div className="profile-picture">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" />
              ) : (
                <div className="default-avatar">
                  <span>{(user.displayName || user.email).charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>
            <button className="edit-photo-btn">📷 Change Photo</button>
          </div>
          
          <div className="profile-info">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editedProfile.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Your name"
                  className="edit-input"
                />
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  className="edit-textarea"
                  rows="3"
                />
                <textarea
                  value={editedProfile.fitnessGoals}
                  onChange={(e) => handleInputChange('fitnessGoals', e.target.value)}
                  placeholder="What are your fitness goals?"
                  className="edit-textarea"
                  rows="2"
                />
                <div className="edit-actions">
                  <button onClick={handleSaveProfile} className="btn btn-primary">Save Changes</button>
                  <button onClick={handleEditToggle} className="btn btn-outline">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <h1 className="user-name">{editedProfile.displayName || user.displayName || 'Fitness Enthusiast'}</h1>
                <p className="user-email">{user.email}</p>
                <p className="user-bio">{editedProfile.bio}</p>
                <div className="fitness-goals">
                  <h4>🎯 Fitness Goals</h4>
                  <p>{editedProfile.fitnessGoals}</p>
                </div>
                <div className="join-date">
                  <span>📅 Member since {userStats.joinDate}</span>
                </div>
                <button onClick={handleEditToggle} className="btn btn-outline">✏️ Edit Profile</button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-section">
          <h2 className="section-title">📊 Your Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💪</div>
              <div className="stat-content">
                <h3>{userStats.totalWorkouts}</h3>
                <p>Total Workouts</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{userStats.totalPoints}</h3>
                <p>Total Points</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>{userStats.currentStreak}</h3>
                <p>Day Streak</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>{userStats.workoutsThisWeek}</h3>
                <p>This Week</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="action-grid">
            <Link href="/workout" className="action-card">
              <div className="action-icon">🏋️</div>
              <h3>Browse Workouts</h3>
              <p>Find your next workout routine</p>
            </Link>
            <Link href="/leaderboard" className="action-card">
              <div className="action-icon">🏆</div>
              <h3>View Leaderboard</h3>
              <p>See how you rank against others</p>
            </Link>
            <Link href="/dashboard" className="action-card">
              <div className="action-icon">📈</div>
              <h3>Dashboard</h3>
              <p>View your progress and activity</p>
            </Link>
          </div>
        </div>

        {/* Account Settings */}
        <div className="settings-section">
          <h2 className="section-title">⚙️ Account Settings</h2>
          <div className="settings-grid">
            <div className="setting-item">
              <span>🔔 Notifications</span>
              <button className="toggle-btn">ON</button>
            </div>
            <div className="setting-item">
              <span>{isConnected ? '✅ Strava Connected' : '📱 Connect Strava'}</span>
              <button 
                onClick={isConnected ? disconnectFromStrava : connectToStrava}
                className={`btn ${isConnected ? 'btn-danger' : 'btn-outline'} btn-sm`}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
            <div className="setting-item danger">
              <span>🚪 Logout</span>
              <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile