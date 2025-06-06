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
    // Check if the response is HTML and extract text content if needed
    if (responseText.includes('<html') || responseText.includes('<body') || responseText.includes('<div')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = responseText;
      responseText = tempDiv.textContent || tempDiv.innerText || responseText;
    }
    
    // Try to extract structured sections from the text
    const sections = {};
    
    // Extract title (usually at the beginning or after a heading)
    const titleMatch = responseText.match(/^(.+?)(?:\n|$)/) || 
                      responseText.match(/#+\s*(.+?)(?:\n|$)/);
    if (titleMatch) {
      sections.title = titleMatch[1].trim();
    }
    
    // Extract personality profile (usually the first few paragraphs)
    const profileMatch = responseText.match(/(?:1\.?\s*Personality\s*Profile:?\s*\n*)([\s\S]+?)(?=2\.?\s*Key\s*Personality\s*Traits:?)/i);
    if (profileMatch) {
      sections.profile = profileMatch[1].trim();
    }
    
    // Extract key traits (usually bullet points)
    const traitsMatch = responseText.match(/(?:2\.?\s*Key\s*Personality\s*Traits:?\s*\n*)([\s\S]+?)(?=3\.?\s*Music\s*Taste\s*Analysis:?)/i);
    if (traitsMatch) {
      const traitsText = traitsMatch[1];
      sections.traits = traitsText
        .split(/\n/)
        .filter(line => line.trim().match(/^[\*\-•]|^\d+\./) || line.trim().length > 0)
        .map(line => line.replace(/^[\*\-•]|\d+\./, '').trim())
        .filter(line => line.length > 0);
    }
    
    // Extract music taste analysis
    const musicMatch = responseText.match(/(?:3\.?\s*Music\s*Taste\s*Analysis:?\s*\n*)([\s\S]+?)(?=4\.?\s*Fun,\s*Creative\s*Title|$)/i);
    if (musicMatch) {
      sections.music_analysis = musicMatch[1].trim();
    }
    
    // Extract creative title
    const titleCreativeMatch = responseText.match(/(?:4\.?\s*Fun,\s*Creative\s*Title[^:]*:?\s*\n*)([\s\S]+?)(?=$)/i);
    if (titleCreativeMatch) {
      sections.creative_title = titleCreativeMatch[1].trim()
        .replace(/^"(.+)"$/, '$1')
        .replace(/^"(.+)"$/, '$1');
    }
    
    // If we couldn't extract structured sections, return the full text
    if (Object.keys(sections).length === 0) {
      return {
        personality_analysis: responseText
      };
    }
    
    return sections;
  } catch (error) {
    console.error('Error parsing analysis:', error);
    return { personality_analysis: responseText }; // Return the original text if parsing fails
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
