import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../utils/spotify';

export default function useAuth() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage
    const storedToken = localStorage.getItem('spotify_access_token');
    
    if (storedToken) {
      setToken(storedToken);
      setAccessToken(storedToken);
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('spotify_access_token');
    setToken(null);
    navigate('/');
  };

  return { token, loading, logout };
}