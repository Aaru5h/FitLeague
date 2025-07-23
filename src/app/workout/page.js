// 'use client'
// import React, { useState } from 'react'
// import './styles.css'

// const Workout = () => {

//   const [workouts,setWorkouts] = useState([])
//   const [type, setType] = useState('')
//   const [difficulty, setDifficulty] = useState('Beginner')
//   const [workoutType, setWorkoutType] = useState('None')
//   const [duration, setDuration] = useState('15 minutes')

//   function handleWorkoutTypeChange(e){
//     setType(e.target.value)
//     setWorkoutType(e.target.value)
//   }

//   function handleDifficulty(e){
//     setDifficulty(e.target.value)
//   }

//   function handleClick(){
//     if (workoutType === 'None') return;

//     const workoutSummary = `${difficulty} ${workoutType} for ${duration}`;
//     setWorkouts([...workouts, workoutSummary])
//     setDifficulty('Beginner')
//     setWorkoutType('None')
//     setDuration('15 minutes')
//   }

//   return (
//     <div>
//       <h1>Today's Workout</h1>
//       <h3>Get your daily dose of sweat</h3>

//       <div className='filter'>

//         <div className='Difficulty-options'>
//           <label>Select Your Difficulty</label>
//           <select className='Difficulty' value={difficulty} onChange={handleDifficulty}>
//             <option value='Beginner'>Beginner</option>
//             <option value='Intermediate'>Intermediate</option>
//             <option value='Pro'>Pro</option>
//           </select>
//         </div>

//         <div className='WorkoutType-container'>
//           <label>Workout Type</label>
//           <select className='WorkoutType' onChange={handleWorkoutTypeChange} value={workoutType}>
//             <option value='None'>None</option>
//             <option value='Legs'>Legs</option>
//             <option value='Biceps'>Biceps</option>
//             <option value='Core'>Core</option>
//             <option value='Full Body'>Full Body</option>
//           </select>
//         </div>

//         <div className='Duration-container'>
//           <label>Duration of the Workout</label>
//           <select className='Duration' value={duration} onChange={(e) => setDuration(e.target.value)}>
//             <option>15 minutes</option>
//             <option>30 minutes</option>
//             <option>45 minutes</option>
//             <option>1 hour</option>
//           </select>
//         </div>
//       </div>

//       <button className='generate' onClick={handleClick}>Generate Workout</button>

//       <div className='Workout-display'>
//         <h2>Your Workout for today</h2>
//         {workouts.length === 0 ?
//           <p>No Workout Scheduled</p>
//           :
//           <ul>
//             {
//               workouts.map((workout,index)=>(
//                 <li key={index}>{workout}</li>
//               ))
//             }
//           </ul>
//         }
//       </div>
//     </div>
//   )
// }

// export default Workout


'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { getFallbackWorkout, generateRandomWorkout } from '@/services/workoutService'
import './workout.css'

export default function WorkoutsPage() {
  const [loading, setLoading] = useState(true)
  const [workouts, setWorkouts] = useState([])
  const [filteredWorkouts, setFilteredWorkouts] = useState([])
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [generating, setGenerating] = useState(false)
  
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Generate initial set of workouts
    generateInitialWorkouts()
  }, [user, router])

  const generateInitialWorkouts = async () => {
    setLoading(true)
    try {
      const difficulties = ['beginner', 'intermediate', 'advanced']
      const initialWorkouts = []

      // Generate 3 workouts for each difficulty
      for (const difficulty of difficulties) {
        for (let i = 0; i < 3; i++) {
          const workout = getFallbackWorkout(difficulty)
          workout.id = `${difficulty}-${i + 1}`
          workout.category = i === 0 ? 'Full Body' : i === 1 ? 'Upper Body' : 'Lower Body'
          initialWorkouts.push(workout)
        }
      }

      setWorkouts(initialWorkouts)
      setFilteredWorkouts(initialWorkouts)
    } catch (error) {
      console.error('Error generating initial workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewWorkout = async () => {
    setGenerating(true)
    try {
      const difficulties = ['beginner', 'intermediate', 'advanced']
      const categories = ['Full Body', 'Upper Body', 'Lower Body', 'Cardio', 'Core']
      
      // If filters are active, use those for the new workout to ensure it's visible
      let randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
      let randomCategory = categories[Math.floor(Math.random() * categories.length)]
      
      // Use current filters if they're not 'all' to ensure new workout is visible
      if (selectedDifficulty !== 'all') {
        randomDifficulty = selectedDifficulty
      }
      if (selectedCategory !== 'all') {
        randomCategory = selectedCategory
      }
      
      const newWorkout = getFallbackWorkout(randomDifficulty)
      newWorkout.id = `custom-${Date.now()}`
      newWorkout.category = randomCategory
      newWorkout.name = `${randomCategory} ${randomDifficulty.charAt(0).toUpperCase() + randomDifficulty.slice(1)} Workout`
      
      const updatedWorkouts = [...workouts, newWorkout]
      setWorkouts(updatedWorkouts)
      
      // Apply current filters to show the new workout
      const newFilteredWorkouts = filterWorkoutsAndReturn(updatedWorkouts, selectedDifficulty, selectedCategory)
      setFilteredWorkouts(newFilteredWorkouts)
      
      // Show success message
      setTimeout(() => {
        alert(`New ${randomCategory} ${randomDifficulty} workout generated! 💪`)
      }, 100)
    } catch (error) {
      console.error('Error generating new workout:', error)
      alert('Failed to generate workout. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const filterWorkoutsAndReturn = (workoutList, difficulty, category) => {
    let filtered = workoutList

    if (difficulty !== 'all') {
      filtered = filtered.filter(workout => workout.difficulty === difficulty)
    }

    if (category !== 'all') {
      filtered = filtered.filter(workout => workout.category === category)
    }

    return filtered
  }

  const filterWorkouts = (workoutList, difficulty, category) => {
    const filtered = filterWorkoutsAndReturn(workoutList, difficulty, category)
    setFilteredWorkouts(filtered)
  }

  const handleDifficultyChange = (difficulty) => {
    setSelectedDifficulty(difficulty)
    filterWorkouts(workouts, difficulty, selectedCategory)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    filterWorkouts(workouts, selectedDifficulty, category)
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
              <p>Loading workouts...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="workout-page">
      <main className="workout-main">
        <div className="container">
          <div className="workout-header">
            <h1 className="workout-title">💪 Browse Workouts</h1>
            <p className="workout-subtitle">
              Discover personalized workouts designed to match your fitness level and goals
            </p>
          </div>

          <div className="workout-controls">
            <div className="workout-filters">
              <div className="filter-group">
                <label htmlFor="difficulty">Difficulty:</label>
                <select 
                  id="difficulty"
                  value={selectedDifficulty} 
                  onChange={(e) => handleDifficultyChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="category">Category:</label>
                <select 
                  id="category"
                  value={selectedCategory} 
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Categories</option>
                  <option value="Full Body">Full Body</option>
                  <option value="Upper Body">Upper Body</option>
                  <option value="Lower Body">Lower Body</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Core">Core</option>
                </select>
              </div>
            </div>

            <button 
              onClick={generateNewWorkout}
              disabled={generating}
              className="btn btn-primary"
            >
              {generating ? 'Generating...' : '+ Generate New Workout'}
            </button>
          </div>

          <div className="workouts-grid">
            {filteredWorkouts.map((workout) => (
              <div key={workout.id} className="workout-card">
                <div className="workout-card-header">
                  <h3 className="workout-name">{workout.name}</h3>
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
                    <span>{workout.estimatedDuration} mins</span>
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

                <div className="exercise-preview">
                  {workout.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={exercise.id} className="exercise-preview-item">
                      <span className="exercise-name">{exercise.name}</span>
                      <span className="exercise-detail">{exercise.sets} × {exercise.reps}</span>
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <p className="more-exercises">
                      +{workout.exercises.length - 3} more exercises
                    </p>
                  )}
                </div>

                <div className="workout-card-actions">
                  <Link 
                    href={`/workout/${workout.id}`} 
                    className="btn btn-outline"
                  >
                    View Details
                  </Link>
                  <button className="btn btn-primary">
                    Start Workout
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredWorkouts.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏋️‍♀️</div>
              <h3>No workouts found</h3>
              <p>Try adjusting your filters or generate a new workout to get started!</p>
              <button 
                onClick={generateNewWorkout}
                className="btn btn-primary mt-4"
              >
                Generate Your First Workout
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
