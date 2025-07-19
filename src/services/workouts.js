const WGER_API_KEY = process.env.NEXT_PUBLIC_WGER_API_KEY;

export const fetchExercises = async () => {
  if (!WGER_API_KEY) {
    console.error("Missing WGER API key");
    return [];
  }

  try {
    const res = await fetch('https://wger.de/api/v2/exerciseinfo/?language=2&limit=20', {
      headers: {
        Authorization: `Token ${WGER_API_KEY}`
      }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch exercises');
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }
};
