'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { getFallbackWorkout, generateWgerWorkout } from '@/services/workoutService'
import '../workout.css'

export default function WorkoutDetailPage() {
  const [loading, setLoading] = useState(true)
  const [workout, setWorkout] = useState(null)
  const [workoutStarted, setWorkoutStarted] = useState(false)
  const [completedExercises, setCompletedExercises] = useState(new Set())
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    loadWorkout()
  }, [user, router, params.id])

  useEffect(() => {
    let interval = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(timer => timer + 1)
      }, 100)
    } else if (!isTimerRunning && workoutTimer !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, workoutTimer])

  const loadWorkout = () => {
    setLoading(true)
    try {
      let difficulty = 'intermediate'
      let category = 'Full Body'

      if (params.id.includes('beginner')) difficulty = 'beginner'
      if (params.id.includes('advanced')) difficulty = 'advanced'
      if (params.id.includes('upper')) category = 'Upper Body'
      if (params.id.includes('lower')) category = 'Lower Body'

      const workoutData = getFallbackWorkout(difficulty)
      workoutData.id = params.id
      workoutData.category = category
      workoutData.name = `${category} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Workout`
      
      setWorkout(workoutData)
    } catch (error) {
      console.error('Error loading workout:', error)
    } finally {
      setLoading(false)
    }
  }

  const startWorkout = () => {
    setWorkoutStarted(true)
    setIsTimerRunning(true)
    setCurrentExerciseIndex(0)
  }

  const completeExercise = (exerciseIndex) => {
    const newCompleted = new Set(completedExercises)
    newCompleted.add(exerciseIndex)
    setCompletedExercises(newCompleted)

    // Move to next exercise if available
    if (exerciseIndex === currentExerciseIndex && exerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1)
    }
  }

  const uncompleteExercise = (exerciseIndex) => {
    const newCompleted = new Set(completedExercises)
    newCompleted.delete(exerciseIndex)
    setCompletedExercises(newCompleted)
  }

  const finishWorkout = () => {
    setIsTimerRunning(false)
    // Here you would typically save the workout completion to the database
    alert('Congratulations! Workout completed! 🎉')
  }

  const pauseTimer = () => {
    setIsTimerRunning(!isTimerRunning)
  }

  const resetWorkout = () => {
    setWorkoutStarted(false)
    setCompletedExercises(new Set())
    setCurrentExerciseIndex(0)
    setWorkoutTimer(0)
    setIsTimerRunning(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#28a745'
      case 'intermediate': return '#ffc107'
      case 'advanced': return '#dc3545'
      default: return '#007bff'
    }
  }

  if (loading) {
    return (
      <div className="workout-page">
        <main className="workout-main">
          <div className="container">
            <div className="loading-wrapper">
              <div className="loading-spinner"></div>
              <p>Loading workout...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="workout-page">
        <main className="workout-main">
          <div className="container">
            <div className="empty-state">
              <h2>Workout Not Found</h2>
              <p>The workout you're looking for doesn't exist.</p>
              <Link href="/workout" className="btn btn-primary">
                Back to Workouts
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const isWorkoutComplete = completedExercises.size === workout.exercises.length
  const progressPercentage = (completedExercises.size / workout.exercises.length) * 100

  return (
    <div className="workout-page">
      <main className="workout-main">
        <div className="container">
          <div className="workout-header">
            <div style={{ marginBottom: '1rem' }}>
              <Link href="/workout" style={{ color: '#007bff', textDecoration: 'none' }}>← Back to Workouts</Link>
            </div>
            
            <div className="workout-card" style={{ marginBottom: '2rem' }}>
              <div className="workout-card-header">
                <h1 className="workout-name">{workout.name}</h1>
                <span 
                  className="difficulty-badge"
                  style={{ backgroundColor: getDifficultyColor(workout.difficulty) }}
                >
                  {workout.difficulty}
                </span>
              </div>

              <div className="workout-info">
                <div className="info-item">
                  <span className="info-icon">⏱️</span>
                  <span>Est. {workout.estimatedDuration} mins</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🎯</span>
                  <span>{workout.category}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">💪</span>
                  <span>{workout.exercises.length} exercises</span>
                </div>
              </div>
            </div>
          </div>

          {workoutStarted && (
            <div className="workout-card" style={{ marginBottom: '2rem', background: '#f8f9fa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                  Time: <span style={{ color: '#007bff' }}>{formatTime(workoutTimer)}</span>
                </div>
                
                <div style={{ flex: 1, margin: '0 2rem' }}>
                  <div style={{ background: '#e9ecef', borderRadius: '10px', overflow: 'hidden', height: '20px' }}>
                    <div 
                      style={{ 
                        background: '#28a745', 
                        height: '100%', 
                        width: `${progressPercentage}%`,
                        transition: 'width 0.3s ease'
                      }}
                    ></div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#6c757d' }}>
                    {completedExercises.size}/{workout.exercises.length} exercises completed
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={pauseTimer}
                    className={`btn ${isTimerRunning ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </button>
                  
                  {isWorkoutComplete && (
                    <button onClick={finishWorkout} className="btn btn-primary" style={{ background: '#28a745' }}>
                      Finish Workout
                    </button>
                  )}
                  
                  <button onClick={resetWorkout} className="btn btn-outline">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          )}

          {!workoutStarted && (
            <div className="workout-card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2>Ready to Start?</h2>
              <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
                This {workout.difficulty} workout consists of {workout.exercises.length} exercises 
                and should take approximately {workout.estimatedDuration} minutes to complete.
              </p>
              <button onClick={startWorkout} className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                🚀 Start Workout
              </button>
            </div>
          )}

          <div className="workouts-grid" style={{ gridTemplateColumns: '1fr' }}>
            <h2 style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>Exercises</h2>
            
            {workout.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.has(index)
              const isCurrent = workoutStarted && index === currentExerciseIndex
              
              return (
                <div 
                  key={exercise.id} 
                  className="workout-card"
                  style={{
                    border: isCurrent ? '2px solid #007bff' : '1px solid #e9ecef',
                    background: isCompleted ? '#d4edda' : 'white',
                    position: 'relative'
                  }}
                >
                  <div className="workout-card-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '2rem',
                          height: '2rem',
                          borderRadius: '50%',
                          background: isCompleted ? '#28a745' : isCurrent ? '#007bff' : '#e9ecef',
                          color: isCompleted || isCurrent ? 'white' : '#495057',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}
                      >
                        {isCompleted ? '✓' : index + 1}
                      </span>
                      <div>
                        <h3 className="workout-name" style={{ margin: 0, fontSize: '1.1rem' }}>{exercise.name}</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                          <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                            {exercise.sets} sets × {exercise.reps} reps
                          </span>
                          <span style={{ color: '#28a745', fontSize: '0.9rem' }}>
                            Rest: {exercise.rest}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {workoutStarted && (
                      <button
                        onClick={() => isCompleted ? uncompleteExercise(index) : completeExercise(index)}
                        className={`btn ${isCompleted ? 'btn-outline' : 'btn-primary'}`}
                      >
                        {isCompleted ? 'Undo' : 'Complete'}
                      </button>
                    )}
                  </div>

                  {exercise.description && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      <p style={{ margin: 0, color: '#495057' }}>{exercise.description}</p>
                    </div>
                  )}

                  {exercise.muscles && exercise.muscles.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <span style={{ fontWeight: '600', color: '#495057', marginRight: '0.5rem' }}>Target muscles:</span>
                      {exercise.muscles.map((muscle, idx) => (
                        <span 
                          key={idx} 
                          style={{
                            display: 'inline-block',
                            background: '#007bff',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            marginRight: '0.5rem',
                            marginTop: '0.25rem'
                          }}
                        >
                          {muscle}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
