import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Format track data for the prompt
export const formatTracksForPrompt = (tracks) => {
  return tracks.map(track => {
    const artists = track.artists.map(artist => artist.name).join(', ');
    return `"${track.name}" by ${artists}`;
  }).join('\n');
};

// Generate personality analysis using AWS Bedrock
export const generatePersonalityAnalysis = async (tracksText) => {
  const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
  const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY;
  const secretAccessKey = import.meta.env.VITE_AWS_SECRET_KEY;
  
  if (!accessKeyId || !secretAccessKey) {
    console.error('AWS credentials are missing');
    throw new Error('AWS credentials are required');
  }
  
  try {
    // Initialize the Bedrock client
    const client = new BedrockRuntimeClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });
    
    // Using Claude model (Anthropic Claude on AWS Bedrock)
    const modelId = "anthropic.claude-v2";
    
    // Prepare the prompt for Claude
    const prompt = `Human: You are a music psychologist who specializes in analyzing personality traits based on music preferences. Based on this person's favorite music:\n\n${tracksText}\n\nWrite a fun 2-3 sentence analysis of their personality. Be creative and playful but keep it short. Focus on what their music taste says about them as a person.\n\nAssistant:`;
    
    // Prepare the request
    const input = {
      modelId,
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        prompt,
        max_tokens_to_sample: 300,
        temperature: 0.7,
        top_p: 0.9,
      })
    };
    
    const command = new InvokeModelCommand(input);
    const response = await client.send(command);
    
    // Parse the response
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    
    if (responseBody.completion) {
      return responseBody.completion.trim();
    } else {
      throw new Error('Invalid response format from AWS Bedrock');
    }
  } catch (error) {
    console.error('Error generating analysis with AWS Bedrock:', error);
    throw error;
  }
};