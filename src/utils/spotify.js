import SpotifyWebApi from 'spotify-web-api-js';
import axios from 'axios';

const spotifyApi = new SpotifyWebApi();

// Spotify authentication parameters from environment variables
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = ['user-top-read', 'user-library-read'];

// Log the redirect URI to verify it's correct
console.log('Using Redirect URI:', REDIRECT_URI);

// Generate random string for state parameter
const generateRandomString = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Get login URL for Spotify authentication
export const getLoginUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  const authUrl = 'https://accounts.spotify.com/authorize';
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: SCOPES.join(' '),
    show_dialog: true
  });
  
  const url = `${authUrl}?${params.toString()}`;
  console.log('Generated auth URL:', url);
  return url;
};

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code) => {
  try {
    // NOTE: In a production app, this should be done server-side
    // We're doing it client-side for demo purposes only
    
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const payload = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    });
    
    const response = await axios.post(tokenUrl, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const { access_token, refresh_token, expires_in } = response.data;
    
    // Store tokens
    localStorage.setItem('spotify_access_token', access_token);
    localStorage.setItem('spotify_refresh_token', refresh_token);
    localStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
    
    // Set the access token for the Spotify Web API
    spotifyApi.setAccessToken(access_token);
    
    return access_token;
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    throw error;
  }
};

// Set the access token for Spotify API calls
export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
  localStorage.setItem('spotify_access_token', token);
};

// Get user's top tracks
export const getTopTracks = async (limit = 10) => {
  try {
    const response = await spotifyApi.getMyTopTracks({ limit });
    return response.items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    throw error;
  }
};

// Get user profile information
export const getUserProfile = async () => {
  try {
    return await spotifyApi.getMe();
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Fallback to mock data if authentication fails
export const useMockData = () => {
  localStorage.setItem('using_mock_data', 'true');
};

export default spotifyApi;