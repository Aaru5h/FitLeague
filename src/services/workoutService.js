// Wger API Integration for Exercise Data

const WGER_API_URL = 'https://wger.de/api/v2';

export const getExercises = async (muscleGroup = '', equipment = '', page = 1) => {
  try {
    let url = `${WGER_API_URL}/exercise/?language=2&status=2&page=${page}`;
    
    if (muscleGroup) {
      url += `&muscles=${muscleGroup}`;
    }
    
    if (equipment) {
      url += `&equipment=${equipment}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercises');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

export const getExerciseCategories = async () => {
  try {
    const response = await fetch(`${WGER_API_URL}/exercisecategory/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercise categories');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching exercise categories:', error);
    throw error;
  }
};

export const getMuscleGroups = async () => {
  try {
    const response = await fetch(`${WGER_API_URL}/muscle/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch muscle groups');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching muscle groups:', error);
    throw error;
  }
};

export const getEquipment = async () => {
  try {
    const response = await fetch(`${WGER_API_URL}/equipment/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch equipment');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

export const generateRandomWorkout = async (difficulty = 'intermediate', duration = 30) => {
  try {
    // Get a variety of exercises from different muscle groups
    const exercises = await getExercises();
    
    if (!exercises.results || exercises.results.length === 0) {
      throw new Error('No exercises found');
    }
    
    // Simple workout generation logic
    const selectedExercises = exercises.results
      .slice(0, 8) // Get first 8 exercises
      .map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        description: exercise.description || 'No description available',
        category: exercise.category,
        muscles: exercise.muscles,
        muscles_secondary: exercise.muscles_secondary,
        sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
        reps: difficulty === 'beginner' ? '8-10' : difficulty === 'intermediate' ? '10-12' : '12-15',
        rest: '30-60 seconds'
      }));
    
    return {
      id: Date.now(),
      name: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Workout`,
      difficulty,
      estimatedDuration: duration,
      exercises: selectedExercises,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating workout:', error);
    throw error;
  }
};

// Fallback workout data in case Wger API is unavailable
export const getFallbackWorkout = (difficulty = 'intermediate') => {
  const exercises = [
    {
      id: 1,
      name: 'Push-ups',
      description: 'Classic bodyweight exercise targeting chest, shoulders, and triceps',
      category: 'Upper Body',
      muscles: ['Chest', 'Shoulders', 'Triceps'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '8-10' : difficulty === 'intermediate' ? '10-15' : '15-20',
      rest: '30-60 seconds'
    },
    {
      id: 2,
      name: 'Squats',
      description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings',
      category: 'Lower Body',
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '10-12' : difficulty === 'intermediate' ? '12-15' : '15-20',
      rest: '45-60 seconds'
    },
    {
      id: 3,
      name: 'Plank',
      description: 'Core strengthening exercise',
      category: 'Core',
      muscles: ['Abs', 'Core'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '20-30 seconds' : difficulty === 'intermediate' ? '30-45 seconds' : '45-60 seconds',
      rest: '30 seconds'
    },
    {
      id: 4,
      name: 'Jumping Jacks',
      description: 'Full body cardio exercise',
      category: 'Cardio',
      muscles: ['Full Body'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '15-20' : difficulty === 'intermediate' ? '20-30' : '30-40',
      rest: '30 seconds'
    }
  ];
  
  return {
    id: Date.now(),
    name: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Home Workout`,
    difficulty,
    estimatedDuration: 20,
    exercises,
    createdAt: new Date().toISOString()
  };
};

// For backward compatibility with the existing workout page
export const fetchExercises = async () => {
  try {
    const response = await getExercises();
    return response.results || [];
  } catch (error) {
    console.error('Error fetching exercises:', error);
    // Return fallback exercises
    return [
      {
        name: 'Push-ups',
        description: 'Classic bodyweight exercise targeting chest, shoulders, and triceps'
      },
      {
        name: 'Squats', 
        description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings'
      },
      {
        name: 'Plank',
        description: 'Core strengthening exercise'
      },
      {
        name: 'Jumping Jacks',
        description: 'Full body cardio exercise'
      },
      {
        name: 'Lunges',
        description: 'Single-leg exercise that targets the glutes, quads, and hamstrings'
      }
    ];
  }
};
