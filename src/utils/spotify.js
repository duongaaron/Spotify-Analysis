import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Spotify authentication parameters - hardcoded for reliability
const CLIENT_ID = '6ced8ce22bb248bf8a2c852d01cce454';
const REDIRECT_URI = 'http://127.0.0.1:5173/callback';
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

// Get login URL for Spotify authentication - try both flows
// In spotify.js
export const getLoginUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  const authUrl = 'https://accounts.spotify.com/authorize';
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',  // Use authorization code flow
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: SCOPES.join(' '),
    show_dialog: true
  });
  
  console.log('Auth URL:', `${authUrl}?${params.toString()}`);
  return `${authUrl}?${params.toString()}`;
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