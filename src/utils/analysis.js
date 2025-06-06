import axios from 'axios';
import generateAnalysisFromTracks from './mockAnalysis';

// Format track data for the prompt
export const formatTracksForPrompt = (tracks) => {
  return tracks.map(track => {
    const artists = track.artists.map(artist => artist.name).join(', ');
    return `"${track.name}" by ${artists}`;
  }).join('\n');
};

// Parse the analysis response from Claude
export const parseAnalysisResponse = (responseText) => {
  try {
    // Try to extract structured sections from the text
    const sections = {};
    
    // Extract title (usually at the beginning or after a heading)
    const titleMatch = responseText.match(/^(.+?)(?:\n|$)/) || 
                      responseText.match(/#+\s*(.+?)(?:\n|$)/);
    if (titleMatch) {
      sections.title = titleMatch[1].trim();
    }
    
    // Extract personality profile (usually the first few paragraphs)
    const profileMatch = responseText.match(/(?:personality profile:?\s*\n*)([\s\S]+?)(?:\n\s*\n|\d\.|\*|\-|#)/i);
    if (profileMatch) {
      sections.profile = profileMatch[1].trim();
    }
    
    // Extract key traits (usually bullet points)
    const traitsMatch = responseText.match(/(?:key (?:personality )?traits:?\s*\n*)([\s\S]+?)(?:\n\s*\n|music taste|#)/i);
    if (traitsMatch) {
      const traitsText = traitsMatch[1];
      sections.traits = traitsText
        .split(/\n/)
        .filter(line => line.trim().match(/^[\*\-•]|^\d+\./) || line.trim().length > 0)
        .map(line => line.replace(/^[\*\-•]|\d+\./, '').trim())
        .filter(line => line.length > 0);
    }
    
    // Extract music taste analysis
    const musicMatch = responseText.match(/(?:music taste analysis:?\s*\n*)([\s\S]+?)(?:\n\s*\n|#|$)/i);
    if (musicMatch) {
      sections.music_analysis = musicMatch[1].trim();
    }
    
    // If we couldn't extract structured sections, return the full text
    if (Object.keys(sections).length === 0) {
      return responseText;
    }
    
    return sections;
  } catch (error) {
    console.error('Error parsing analysis:', error);
    return responseText; // Return the original text if parsing fails
  }
};

// Generate personality analysis using your API Gateway endpoint
export const generatePersonalityAnalysis = async (tracksText, originalTracks) => {
  try {
    // Get API endpoint from environment variables or use default
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT || 'https://efhmxhffi3.execute-api.us-east-1.amazonaws.com/prod/analyze';
    
    console.log('Sending tracks to API Gateway:', tracksText);
    
    // Get access token from localStorage
    const accessToken = localStorage.getItem('spotify_access_token');
    
    if (!accessToken) {
      throw new Error('No Spotify access token found');
    }
    
    // Send both the formatted tracks and the access token
    const response = await axios.post(apiEndpoint, {
      tracks: tracksText,
      access_token: accessToken,
      time_range: 'medium_term'
    });
    
    console.log('API Gateway response received');
    
    // Extract the analysis from the response
    if (response.data) {
      if (response.data.personality_analysis) {
        // Try to parse the analysis into structured sections
        return parseAnalysisResponse(response.data.personality_analysis);
      } else if (response.data.analysis) {
        // Alternative response format
        return parseAnalysisResponse(response.data.analysis);
      } else {
        console.error('Unexpected response format:', response.data);
        console.log('Falling back to local analysis');
        
        // Fallback to local analysis if API fails
        return generateAnalysisFromTracks(originalTracks);
      }
    } else {
      throw new Error('Empty response from API');
    }
  } catch (error) {
    console.error('Error generating analysis:', error);
    
    if (error.response) {
      console.error('API error details:', error.response.data);
    }
    
    console.log('Falling back to local analysis');
    
    // Fallback to local analysis if API fails
    return generateAnalysisFromTracks(originalTracks);
  }
};