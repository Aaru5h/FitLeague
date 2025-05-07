'use client'
import React, { useState } from 'react'

const Workout = () => {

  const [workouts,setWorkouts] = useState([])
  const [type, setType] = useState('')

  const [difficulty, setDifficulty] = useState('Beginner')
  const [workoutType, setWorkoutType] = useState('None')


  function handleWorkoutTypeChange(e){
    setType(e.target.value)
    setWorkoutType(e.target.value)
  }

  function handleDifficulty(e){
    setDifficulty(e.target.value)
  }

  function handleClick(){
    setWorkouts([...workouts,type])
    setDifficulty('Beginner')
    setWorkoutType('None')
  }
  return (
    <div>
      <h1>Today's Workout</h1>
      <h3>Get your daily dose of sweat</h3>

      <div className='filter'>

        <div className='Difficulty-options'>

          <label>Select Your Difficulty</label>

          <select className='Difficulty' value={difficulty} onChange={handleDifficulty}>
          <option value = 'Beginner'>Beginner</option>
          <option value = 'Intermediate'>Intermediate</option>
          <option value = 'Pro'>Pro</option>
          </select>
        </div>

        <div className='WorkoutType-container'>

          <label>Workout Type</label>

          <select className='WorkoutType' onChange={handleWorkoutTypeChange} value = {workoutType}>
            <option value = 'None'>None</option>
            <option value = 'Legs'>Legs</option>
            <option value = 'Biceps'>Biceps</option>
            <option value = 'Core'>Core</option>
            <option value = 'Full Body'>Full Body</option>
          </select>
        </div>

        <div className='Duration-container'>

          <label>Duration of the Workout</label>
          <select className='Duration'>
            <option>15 minutes</option>
            <option>30 minutes</option>
            <option>45 minutes</option>
            <option>1 hour</option>
          </select>
        </div>
      </div>


      <button className='generate' onClick={handleClick}>Generate Workout</button>


      <div className='Workout-display'>

        <h2>Your Workout for today</h2>

        {workouts.length === 0?
          <p>No Workout Scheduled</p>
          :
          <ul>
            {
              workouts.map((workout,index)=>(
                <li key={index}>{workout}</li>
              ))
            }
          </ul>
        }

      </div>


    </div>
  )
}

export default Workout