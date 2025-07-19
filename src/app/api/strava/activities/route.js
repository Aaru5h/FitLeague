// export async function GET() {
//   const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
//   const clientSecret = process.env.NEXT_PUBLIC_STRAVA_CLIENT_SECRET;
//   const refreshToken = process.env.NEXT_PUBLIC_STRAVA_REFRESH_TOKEN;

//   if (!clientId || !clientSecret || !refreshToken) {
//     return new Response(JSON.stringify({ error: 'Missing environment variables' }), {
//       status: 400,
//     });
//   }

//   try {
//     // Step 1: Get Access Token using Refresh Token
//     const tokenRes = await fetch('https://www.strava.com/api/v3/oauth/token', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         client_id: clientId,
//         client_secret: clientSecret,
//         grant_type: 'refresh_token',
//         refresh_token: refreshToken,
//       }),
//     });

//     const tokenData = await tokenRes.json();

//     if (!tokenRes.ok) {
//       console.error('Token error:', tokenData);
//       return new Response(JSON.stringify({ error: tokenData.message || 'Failed to refresh token' }), {
//         status: 500,
//       });
//     }

//     const accessToken = tokenData.access_token;

//     // Step 2: Get Activities
//     const activitiesRes = await fetch('https://www.strava.com/api/v3/athlete/activities', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     if (!activitiesRes.ok) {
//       console.error('Activities error:', await activitiesRes.text());
//       return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), {
//         status: 500,
//       });
//     }

//     const activities = await activitiesRes.json();

//     // Limit to top 10
//     return new Response(JSON.stringify(activities.slice(0, 10)), {
//       status: 200,
//     });
//   } catch (err) {
//     console.error('Unexpected error:', err);
//     return new Response(JSON.stringify({ error: err.message || 'Unexpected error' }), {
//       status: 500,
//     });
//   }
// }


export async function GET() {
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const refreshToken = process.env.STRAVA_REFRESH_TOKEN;

  try {
    // Step 1: Get new access token
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
      console.error("Token error:", tokenData);
      throw new Error(tokenData.message || 'Failed to refresh Strava token');
    }

    const accessToken = tokenData.access_token;
    console.log("Access Token:", accessToken);

    // Step 2: Fetch activities
    const res = await fetch('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await res.json(); // capture error message or success
    console.log("Activities fetch response:", data);

    if (!res.ok) {
      console.error("Activities fetch error:", data);
      return new Response(JSON.stringify({ error: 'Failed to fetch activities' }), { status: 500 });
    }

    return new Response(JSON.stringify(data.slice(0, 10)), { status: 200 });

  } catch (err) {
    console.error("Catch block error:", err);
    return new Response(JSON.stringify({ error: err.message || 'Unexpected error' }), { status: 500 });
  }
}
