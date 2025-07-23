// Strava API Integration

const STRAVA_AUTH_URL = 'https://www.strava.com/oauth/authorize';
const STRAVA_TOKEN_URL = 'https://www.strava.com/oauth/token';
const STRAVA_API_URL = 'https://www.strava.com/api/v3';

export const getStravaAuthUrl = () => {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const redirectUri = `${window.location.origin}/api/strava/callback`;
  const scope = 'read,activity:read';
  
  return `${STRAVA_AUTH_URL}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
};

export const exchangeCodeForToken = async (code) => {
  const response = await fetch('/api/strava/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  
  return response.json();
};

export const refreshStravaToken = async (refreshToken) => {
  const response = await fetch('/api/strava/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  
  return response.json();
};

export const getStravaActivities = async (accessToken, page = 1, perPage = 30) => {
  try {
    const response = await fetch(
      `${STRAVA_API_URL}/athlete/activities?page=${page}&per_page=${perPage}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch Strava activities');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching Strava activities:', error);
    throw error;
  }
};

export const getAthleteInfo = async (accessToken) => {
  try {
    const response = await fetch(`${STRAVA_API_URL}/athlete`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch athlete info');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching athlete info:', error);
    throw error;
  }
};
