// Example code to integrate with your React frontend

// Function to initiate Spotify authorization
function initiateSpotifyAuth() {
  const clientId = 'YOUR_SPOTIFY_CLIENT_ID'; // Replace with your Spotify Client ID
  const redirectUri = 'https://efhmxhffi3.execute-api.us-east-1.amazonaws.com/prod/callback';
  const scopes = 'user-top-read'; // Required scope to read user's top tracks
  
  // Construct the Spotify authorization URL
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
  
  // Redirect the user to Spotify's authorization page
  window.location.href = authUrl;
}

// Function to analyze personality using the access token
async function analyzePersonality(accessToken, timeRange = 'medium_term') {
  try {
    const response = await fetch('https://efhmxhffi3.execute-api.us-east-1.amazonaws.com/prod/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
        time_range: timeRange
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing personality:', error);
    throw error;
  }
}

// Example React component
/*
import React, { useState, useEffect } from 'react';

function SpotifyAnalyzer() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  
  // Check for access token in URL (after Spotify callback)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // The code would be handled by your backend via the callback endpoint
      // Your frontend would need to get the access token from your backend
      // This is just a placeholder for demonstration
      setLoading(true);
      
      // In a real app, you'd make an API call to your backend to exchange the code
      // for an access token, then store it
      
      // For demo purposes, we'll assume we have the token
      const demoToken = "example_token";
      setAccessToken(demoToken);
      
      // Clean up the URL
      window.history.replaceState({}, document.title, "/");
    }
  }, []);
  
  // When we have an access token, analyze personality
  useEffect(() => {
    if (accessToken) {
      setLoading(true);
      analyzePersonality(accessToken)
        .then(data => {
          setAnalysis(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [accessToken]);
  
  return (
    <div className="spotify-analyzer">
      <h1>Spotify Personality Analyzer</h1>
      
      {!accessToken && !loading && (
        <button onClick={initiateSpotifyAuth}>
          Login with Spotify
        </button>
      )}
      
      {loading && <p>Loading your personality analysis...</p>}
      
      {error && <p className="error">Error: {error}</p>}
      
      {analysis && (
        <div className="analysis-results">
          <h2>{analysis.personality_analysis.title || "Your Personality Analysis"}</h2>
          <div dangerouslySetInnerHTML={{ __html: analysis.personality_analysis.replace(/\\n/g, '<br/>') }} />
          
          <h3>Your Top Tracks</h3>
          <ul>
            {analysis.tracks.slice(0, 10).map((track, index) => (
              <li key={index}>
                {track.name} by {track.artist}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SpotifyAnalyzer;
*/
