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
import React, { useState } from 'react';
import { fetchExercises } from '@/services/workouts';

const Workout = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateWorkout = async () => {
    setLoading(true);
    setError('');
    try {
      const results = await fetchExercises();

      // Filter exercises with both name and description
      const filtered = results.filter(
        (ex) => ex.name && ex.description && ex.description.trim() !== ''
      );

      // Pick 5 random exercises
      const shuffled = filtered.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 5);

      setExercises(selected);
    } catch (err) {
      console.error('Failed to generate workout', err);
      setError('Could not fetch workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-container">
      <h1>Workout Generator</h1>
      <button onClick={generateWorkout} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Workout'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {exercises.map((ex, idx) => (
          <li key={idx} style={{ marginBottom: '1rem' }}>
            <strong>{ex.name}</strong>
            <p dangerouslySetInnerHTML={{ __html: ex.description }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workout;
