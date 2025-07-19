export async function refreshStravaToken() {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.NEXT_PUBLIC_STRAVA_REFRESH_TOKEN;

  try {
    const res = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Error refreshing token:', data);
      throw new Error(data.message || 'Failed to refresh Strava token');
    }

    console.log('Refreshed token:', data);

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at,
    };
  } catch (error) {
    console.error('Error during token refresh:', error);
    return null;
  }
}