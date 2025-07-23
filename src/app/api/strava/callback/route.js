import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const scope = searchParams.get('scope');

    // If user denied access
    if (error === 'access_denied') {
      return NextResponse.redirect(
        new URL('/dashboard?strava_error=access_denied', request.url)
      );
    }

    // If no code provided
    if (!code) {
      return NextResponse.redirect(
        new URL('/dashboard?strava_error=no_code', request.url)
      );
    }

    // Exchange code for token
    const tokenResponse = await fetch(`${request.nextUrl.origin}/api/strava/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(
        new URL('/dashboard?strava_error=token_exchange_failed', request.url)
      );
    }

    // Here you would typically save the tokens to your database
    // For now, we'll just redirect with success and store in localStorage via client-side
    const redirectUrl = new URL('/dashboard', request.url);
    redirectUrl.searchParams.set('strava_success', 'true');
    redirectUrl.searchParams.set('access_token', tokenData.access_token);
    redirectUrl.searchParams.set('refresh_token', tokenData.refresh_token);
    redirectUrl.searchParams.set('athlete_id', tokenData.athlete.id);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?strava_error=callback_error', request.url)
    );
  }
}
