import axios from 'axios';

// Format track data for the AI prompt
export const formatTracksForPrompt = (tracks) => {
  return tracks.map(track => {
    const artists = track.artists.map(artist => artist.name).join(', ');
    return `"${track.name}" by ${artists}`;
  }).join('\n');
};

// Generate personality analysis using OpenAI API
export const generatePersonalityAnalysis = async (tracksText) => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key is missing');
    throw new Error('OpenAI API key is required');
  }
  
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a music psychologist who specializes in analyzing personality traits based on music preferences. Keep your analysis fun, creative, and positive.'
      },
      {
        role: 'user',
        content: `Based on this person's favorite music:\n${tracksText}\n\nWrite a fun 2-3 sentence analysis of their personality. Be creative and playful but keep it short. Focus on what their music taste says about them as a person.`
      }
    ],
    max_tokens: 150,
    temperature: 0.7
  };
  
  // Retry configuration
  const maxRetries = 3;
  const baseDelay = 2000; // 2 seconds
  let retries = 0;
  
  while (true) {
    try {
      console.log(`API request attempt ${retries + 1}/${maxRetries + 1}`);
      
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          }
        }
      );
      
      console.log('OpenAI response status:', response.status);
      
      if (response.data?.choices?.[0]?.message?.content) {
        const content = response.data.choices[0].message.content.trim();
        console.log('Analysis generated successfully');
        return content;
      } else {
        throw new Error('Invalid response format from OpenAI');
      }
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error.message);
      
      // Check if it's a rate limit error (429)
      if (error.response?.status === 429) {
        if (retries < maxRetries) {
          // Calculate delay with exponential backoff
          const delay = baseDelay * Math.pow(2, retries);
          console.log(`Rate limited. Retrying in ${delay}ms (attempt ${retries + 1}/${maxRetries})`);
          
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
          continue;
        } else {
          console.error('Max retries reached for rate limit');
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
      }
      
      // For other errors, just throw
      throw error;
    }
  }
};