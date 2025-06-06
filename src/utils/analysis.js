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
  // For demo purposes, we'll use a mock response
  // In production, you would use the OpenAI API
  
  // Mock analysis - replace with actual API call in production
  const mockAnalyses = [
    "You're a passionate soul with eclectic taste. Your music choices reveal someone who isn't afraid to feel deeply and embrace life's full emotional spectrum.",
    "Your playlist suggests you're a thoughtful dreamer with a nostalgic streak. You appreciate artistry and likely have creative talents of your own.",
    "You're definitely the life of the party! Your upbeat music choices reveal someone who brings energy and positivity to any room they enter.",
    "Your music taste shows you're a deep thinker who values authenticity. You likely have strong opinions and appreciate meaningful conversations.",
    "You have the soul of an explorer. Your diverse music choices suggest someone who's curious about the world and open to new experiences."
  ];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a random mock analysis
  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
  
  /* 
  // Uncomment and use this code when ready to integrate with OpenAI
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
  
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt: `Based on this person's favorite music:\n${tracksText}\n\nWrite a fun 2-3 sentence analysis of their personality. Be creative and playful but keep it short. Focus on what their music taste says about them as a person.`,
        max_tokens: 150,
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );
    
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating analysis:', error);
    return 'Unable to generate personality analysis at this time.';
  }
  */
};