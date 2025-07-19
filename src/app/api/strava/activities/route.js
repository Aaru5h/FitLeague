export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.NEXT_PUBLIC_STRAVA_REFRESH_TOKEN;

  try {
    const tokenRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken
      })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(tokenData.message || 'Failed to refresh Strava token');
    }

    const accessToken = tokenData.access_token;

    const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), {
        status: 500
      });
    }

    const activities = await res.json();

    return new Response(JSON.stringify(activities.slice(0, 10)), { status: 200 });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message || 'Unexpected error' }), {
      status: 500
    });
  }
}