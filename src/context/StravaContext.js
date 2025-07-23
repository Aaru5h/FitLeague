'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { getStravaAuthUrl } from '@/services/strava';

const StravaContext = createContext();

export function useStrava() {
  const context = useContext(StravaContext);
  if (!context) {
    throw new Error('useStrava must be used within a StravaProvider');
  }
  return context;
}

export function StravaProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [athleteData, setAthleteData] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already connected to Strava
    checkStravaConnection();
  }, []);

  const checkStravaConnection = () => {
    try {
      const storedAccessToken = localStorage.getItem('strava_access_token');
      const storedRefreshToken = localStorage.getItem('strava_refresh_token');
      const storedAthleteData = localStorage.getItem('strava_athlete_data');

      if (storedAccessToken && storedRefreshToken) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setIsConnected(true);
        
        if (storedAthleteData) {
          setAthleteData(JSON.parse(storedAthleteData));
        }
      }
    } catch (error) {
      console.error('Error checking Strava connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectToStrava = () => {
    const authUrl = getStravaAuthUrl();
    if (authUrl) {
      window.location.href = authUrl;
    }
  };

  const disconnectFromStrava = () => {
    localStorage.removeItem('strava_access_token');
    localStorage.removeItem('strava_refresh_token');
    localStorage.removeItem('strava_athlete_data');
    
    setAccessToken(null);
    setRefreshToken(null);
    setAthleteData(null);
    setIsConnected(false);
  };

  const handleStravaCallback = (accessToken, refreshToken, athleteData) => {
    localStorage.setItem('strava_access_token', accessToken);
    localStorage.setItem('strava_refresh_token', refreshToken);
    localStorage.setItem('strava_athlete_data', JSON.stringify(athleteData));
    
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAthleteData(athleteData);
    setIsConnected(true);
  };

  const value = {
    isConnected,
    athleteData,
    accessToken,
    refreshToken,
    loading,
    connectToStrava,
    disconnectFromStrava,
    handleStravaCallback,
  };

  return (
    <StravaContext.Provider value={value}>
      {children}
    </StravaContext.Provider>
  );
}
