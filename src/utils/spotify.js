import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Spotify authentication parameters
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const SCOPES = ['user-top-read', 'user-library-read'];

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
    response_type: 'token',
    client_id: CLIENT_ID,
    scope: SCOPES.join(' '),
    redirect_uri: REDIRECT_URI,
    state: state
  });
  
  return `${authUrl}?${params.toString()}`;
};

// Parse the access token from URL hash
export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  
  const token = params.get('access_token');
  const state = params.get('state');
  
  // Verify state matches to prevent CSRF attacks
  const storedState = localStorage.getItem('spotify_auth_state');
  
  if (token && state === storedState) {
    localStorage.removeItem('spotify_auth_state');
    return token;
  }
  
  return null;
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

export default spotifyApi;