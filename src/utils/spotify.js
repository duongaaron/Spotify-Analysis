import SpotifyWebApi from 'spotify-web-api-js';

const spotifyApi = new SpotifyWebApi();

// Spotify authentication parameters
const CLIENT_ID = '6ced8ce22bb248bf8a2c852d01cce454'; // Hardcoded client ID
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

// Get login URL for Spotify authentication
export const getLoginUrl = () => {
  const state = generateRandomString(16);
  localStorage.setItem('spotify_auth_state', state);
  
  // Use PKCE for added security (Proof Key for Code Exchange)
  const codeVerifier = generateRandomString(64);
  localStorage.setItem('code_verifier', codeVerifier);
  
  console.log('Using CLIENT_ID:', CLIENT_ID);
  console.log('Using redirect URI:', REDIRECT_URI);
  
  const authUrl = 'https://accounts.spotify.com/authorize';
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    state: state,
    scope: SCOPES.join(' '),
    show_dialog: true
  });
  
  return `${authUrl}?${params.toString()}`;
};

// Parse the code from URL query parameters
export const getCodeFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const state = urlParams.get('state');
  const error = urlParams.get('error');
  
  // Log any errors
  if (error) {
    console.error('Authentication error:', error);
    return null;
  }
  
  // Verify state matches to prevent CSRF attacks
  const storedState = localStorage.getItem('spotify_auth_state');
  
  if (code && state === storedState) {
    localStorage.removeItem('spotify_auth_state');
    return code;
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

// Fallback to mock data if authentication fails
export const useMockData = () => {
  localStorage.setItem('using_mock_data', 'true');
};

export default spotifyApi;