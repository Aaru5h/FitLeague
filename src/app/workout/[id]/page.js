'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { getFallbackWorkout } from '@/lib/wger'
import styles from './workout.module.css'

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
      router.push('/login')
      return
    }

    loadWorkout()
  }, [user, router, params.id])

  useEffect(() => {
    let interval = null
    if (isTimerRunning) {
      interval = setInterval(() => {
        setWorkoutTimer(timer => timer + 1)
      }, 1000)
    } else if (!isTimerRunning && workoutTimer !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, workoutTimer])

  const loadWorkout = () => {
    setLoading(true)
    try {
      // In a real app, you'd fetch this from an API
      // For now, we'll generate a workout based on the ID
      let difficulty = 'intermediate'
      let category = 'Full Body'

      if (params.id.includes('beginner')) difficulty = 'beginner'
      if (params.id.includes('advanced')) difficulty = 'advanced'
      if (params.id.includes('upper')) category = 'Upper Body'
      if (params.id.includes('lower')) category = 'Lower Body'

      const workoutData = getFallbackWorkout(difficulty)
      workoutData.id = params.id
      workoutData.category = category
      
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
      case 'beginner': return 'var(--success)'
      case 'intermediate': return 'var(--warning)'
      case 'advanced': return 'var(--error)'
      default: return 'var(--primary-color)'
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Navigation />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading workout...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className={styles.page}>
        <Navigation />
        <main className={styles.main}>
          <div className="container">
            <div className={styles.error}>
              <h2>Workout Not Found</h2>
              <p>The workout you're looking for doesn't exist.</p>
              <Link href="/workouts" className="btn btn-primary">
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
    <div className={styles.page}>
      <Navigation />
      
      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <div className={styles.breadcrumb}>
              <Link href="/workouts">Workouts</Link>
              <span> / </span>
              <span>{workout.name}</span>
            </div>
            
            <div className={styles.workoutTitle}>
              <h1 className={styles.title}>{workout.name}</h1>
              <span 
                className={styles.difficultyBadge}
                style={{ backgroundColor: getDifficultyColor(workout.difficulty) }}
              >
                {workout.difficulty}
              </span>
            </div>

            <div className={styles.workoutMeta}>
              <div className={styles.metaItem}>
                <span className={styles.icon}>⏱️</span>
                <span>Est. {workout.estimatedDuration} mins</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.icon}>🎯</span>
                <span>{workout.category}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.icon}>💪</span>
                <span>{workout.exercises.length} exercises</span>
              </div>
            </div>
          </div>

          {workoutStarted && (
            <div className={styles.workoutTracker}>
              <div className={styles.trackerHeader}>
                <div className={styles.timer}>
                  <span className={styles.timerLabel}>Time:</span>
                  <span className={styles.timerValue}>{formatTime(workoutTimer)}</span>
                </div>
                
                <div className={styles.progress}>
                  <span className={styles.progressLabel}>Progress:</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className={styles.progressText}>
                    {completedExercises.size}/{workout.exercises.length}
                  </span>
                </div>

                <div className={styles.trackerActions}>
                  <button 
                    onClick={pauseTimer}
                    className={`btn ${isTimerRunning ? 'btn-outline' : 'btn-primary'}`}
                  >
                    {isTimerRunning ? 'Pause' : 'Resume'}
                  </button>
                  
                  {isWorkoutComplete && (
                    <button onClick={finishWorkout} className="btn btn-success">
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

          <div className={styles.content}>
            {!workoutStarted && (
              <div className={styles.startSection}>
                <div className={styles.startCard}>
                  <h2>Ready to Start?</h2>
                  <p>
                    This {workout.difficulty} workout consists of {workout.exercises.length} exercises 
                    and should take approximately {workout.estimatedDuration} minutes to complete.
                  </p>
                  <button onClick={startWorkout} className="btn btn-primary btn-large">
                    Start Workout
                  </button>
                </div>
              </div>
            )}

            <div className={styles.exerciseList}>
              <h2 className={styles.sectionTitle}>Exercises</h2>
              
              {workout.exercises.map((exercise, index) => {
                const isCompleted = completedExercises.has(index)
                const isCurrent = workoutStarted && index === currentExerciseIndex
                
                return (
                  <div 
                    key={exercise.id} 
                    className={`${styles.exerciseCard} ${isCompleted ? styles.completed : ''} ${isCurrent ? styles.current : ''}`}
                  >
                    <div className={styles.exerciseHeader}>
                      <div className={styles.exerciseInfo}>
                        <span className={styles.exerciseNumber}>{index + 1}</span>
                        <div>
                          <h3 className={styles.exerciseName}>{exercise.name}</h3>
                          <div className={styles.exerciseDetails}>
                            <span>{exercise.sets} sets × {exercise.reps} reps</span>
                            <span className={styles.rest}>Rest: {exercise.rest}</span>
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
                      <div className={styles.exerciseDescription}>
                        <p>{exercise.description}</p>
                      </div>
                    )}

                    {exercise.muscles && exercise.muscles.length > 0 && (
                      <div className={styles.muscleGroups}>
                        <span className={styles.muscleLabel}>Target muscles:</span>
                        {exercise.muscles.map((muscle, idx) => (
                          <span key={idx} className={styles.muscleTag}>
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
        </div>
      </main>
    </div>
  )
}
