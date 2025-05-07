import React from 'react'

const Workout = () => {
  return (
    <div>
      <h1>Today's Workout</h1>
      <h3>Get your daily dose of sweat</h3>

      <div className='filter'>

        <div className='Difficulty-options'>

          <label>Select Your Difficulty</label>

          <select className='Difficulty'>
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Pro</option>
          </select>
        </div>

        <div className='WorkoutType-container'>

          <label>Workout Type</label>

          <select className='WorkoutType'>
            <option>Legs</option>
            <option>Biceps</option>
            <option>Core</option>
            <option>Full Body</option>
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


      <button className='generate'>Generate Workout</button>

    </div>
  )
}

export default Workout