// Wger API Integration for Exercise Data

const WGER_API_URL = 'https://wger.de/api/v2';

// Cache for API responses to reduce requests
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

export const getExercises = async (muscleGroup = '', equipment = '', page = 1, limit = 20) => {
  try {
    const cacheKey = `exercises-${muscleGroup}-${equipment}-${page}-${limit}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    let url = `${WGER_API_URL}/exercise/?language=2&status=2&page=${page}&limit=${limit}`;
    
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
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
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

// Get specific exercise by ID
export const getExerciseById = async (id) => {
  try {
    const cacheKey = `exercise-${id}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${WGER_API_URL}/exercise/${id}/?language=2`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch exercise');
    }
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw error;
  }
};

// Get workout plans from Wger
export const getWorkoutPlans = async (page = 1) => {
  try {
    const cacheKey = `workout-plans-${page}`;
    const cached = getCachedData(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${WGER_API_URL}/workout/?page=${page}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch workout plans');
    }
    
    const data = await response.json();
    setCachedData(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching workout plans:', error);
    throw error;
  }
};

// Generate workout using Wger API with better logic
export const generateWgerWorkout = async (difficulty = 'intermediate', category = 'Full Body', duration = 30) => {
  try {
    let exercises = [];
    let muscleGroups = [];
    
    // Define muscle groups based on category
    switch (category) {
      case 'Upper Body':
        muscleGroups = [1, 2, 4, 5]; // Chest, shoulders, biceps, triceps (approximate Wger IDs)
        break;
      case 'Lower Body':
        muscleGroups = [8, 9, 10, 11]; // Quadriceps, hamstrings, glutes, calves
        break;
      case 'Core':
        muscleGroups = [14]; // Abs
        break;
      case 'Cardio':
        // For cardio, we'll use bodyweight exercises
        exercises = await getExercises('', '', 1, 50);
        break;
      default: // Full Body
        muscleGroups = [1, 2, 8, 9, 14]; // Mix of upper, lower, and core
    }
    
    // Fetch exercises for each muscle group
    const allExercises = [];
    for (const muscleGroup of muscleGroups) {
      try {
        const response = await getExercises(muscleGroup, '', 1, 10);
        if (response.results) {
          allExercises.push(...response.results);
        }
      } catch (error) {
        console.warn(`Failed to fetch exercises for muscle group ${muscleGroup}:`, error);
      }
    }
    
    // If no exercises found or for cardio, use general exercises
    if (allExercises.length === 0) {
      const response = await getExercises('', '', 1, 20);
      allExercises.push(...(response.results || []));
    }
    
    // Select random exercises based on duration
    const numExercises = Math.min(
      Math.max(4, Math.floor(duration / 5)), // 4-12 exercises based on duration
      allExercises.length,
      12
    );
    
    const shuffled = allExercises.sort(() => 0.5 - Math.random());
    const selectedExercises = shuffled.slice(0, numExercises).map((exercise, index) => ({
      id: exercise.id || index + 1,
      name: exercise.name || `Exercise ${index + 1}`,
      description: exercise.description || 'Exercise description not available',
      category: category,
      muscles: exercise.muscles || [],
      muscles_secondary: exercise.muscles_secondary || [],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '8-12' : difficulty === 'intermediate' ? '10-15' : '12-20',
      rest: difficulty === 'beginner' ? '45-60 seconds' : difficulty === 'intermediate' ? '30-45 seconds' : '30 seconds'
    }));
    
    return {
      id: `wger-${Date.now()}`,
      name: `${category} ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Workout`,
      difficulty,
      category,
      estimatedDuration: duration,
      exercises: selectedExercises,
      createdAt: new Date().toISOString(),
      source: 'wger'
    };
  } catch (error) {
    console.error('Error generating Wger workout:', error);
    // Fallback to our custom workout if Wger fails
    return getFallbackWorkout(difficulty);
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
  const baseExercises = [
    {
      id: 1,
      name: 'Push-ups',
      description: 'Classic bodyweight exercise targeting chest, shoulders, and triceps. Start in plank position, lower body to floor, push back up.',
      category: 'Upper Body',
      muscles: ['Chest', 'Shoulders', 'Triceps'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '8-12' : difficulty === 'intermediate' ? '12-15' : '15-20',
      rest: '45-60 seconds'
    },
    {
      id: 2,
      name: 'Bodyweight Squats',
      description: 'Fundamental lower body exercise targeting quads, glutes, and hamstrings. Stand with feet shoulder-width apart, lower into sitting position, return to standing.',
      category: 'Lower Body',
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '12-15' : difficulty === 'intermediate' ? '15-20' : '20-25',
      rest: '45-60 seconds'
    },
    {
      id: 3,
      name: 'Plank Hold',
      description: 'Core strengthening exercise. Hold a straight line from head to heels, engage core muscles throughout.',
      category: 'Core',
      muscles: ['Abs', 'Core', 'Shoulders'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '20-30 seconds' : difficulty === 'intermediate' ? '30-45 seconds' : '45-60 seconds',
      rest: '30-45 seconds'
    },
    {
      id: 4,
      name: 'Jumping Jacks',
      description: 'Full body cardio exercise. Jump feet apart while raising arms overhead, then jump back to starting position.',
      category: 'Cardio',
      muscles: ['Full Body', 'Cardiovascular'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '20-30' : difficulty === 'intermediate' ? '30-40' : '40-50',
      rest: '30-45 seconds'
    },
    {
      id: 5,
      name: 'Lunges',
      description: 'Single-leg exercise targeting glutes, quads, and hamstrings. Step forward into lunge position, return to standing. Alternate legs.',
      category: 'Lower Body',
      muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Calves'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '8-12 each leg' : difficulty === 'intermediate' ? '12-15 each leg' : '15-20 each leg',
      rest: '45-60 seconds'
    },
    {
      id: 6,
      name: 'Mountain Climbers',
      description: 'Dynamic full-body exercise. Start in plank position, alternate bringing knees to chest in running motion.',
      category: 'Cardio',
      muscles: ['Core', 'Shoulders', 'Legs', 'Cardiovascular'],
      sets: difficulty === 'beginner' ? 2 : difficulty === 'intermediate' ? 3 : 4,
      reps: difficulty === 'beginner' ? '15-20' : difficulty === 'intermediate' ? '20-30' : '30-40',
      rest: '30-45 seconds'
    }
  ];
  
  // Select 4-6 exercises based on difficulty
  const numExercises = difficulty === 'beginner' ? 4 : difficulty === 'intermediate' ? 5 : 6;
  const selectedExercises = baseExercises.slice(0, numExercises);
  
  return {
    id: Date.now(),
    name: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Home Workout`,
    difficulty,
    estimatedDuration: difficulty === 'beginner' ? 15 : difficulty === 'intermediate' ? 25 : 35,
    exercises: selectedExercises,
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
