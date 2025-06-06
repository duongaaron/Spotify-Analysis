# Spotify Personality Analyzer

A web application that analyzes your Spotify listening habits and generates a personality profile using AWS Bedrock with Claude 3.7 Sonnet.

## Features

- Authenticate with Spotify
- Fetch your top tracks
- Generate a personality analysis based on your music taste
- View your top tracks with album artwork

## Setup

### Frontend Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   VITE_REDIRECT_URI=http://localhost:5173/callback
   VITE_API_ENDPOINT=your_api_gateway_endpoint
   ```
4. Run the development server:
   ```
   npm run dev
   ```

### AWS Lambda Setup

1. Create a new Lambda function in AWS
2. Upload the `spotify_bedrock_lambda.py` file
3. Set the following environment variables:
   ```
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   REDIRECT_URI=your_frontend_redirect_uri
   ```
4. Configure the Lambda function with the following permissions:
   - `bedrock:InvokeModel` for Claude 3.7 Sonnet
   - Basic Lambda execution role

5. Create an API Gateway trigger:
   - Create a new REST API
   - Create a resource with a POST method
   - Enable CORS
   - Deploy the API

## How It Works

1. User authenticates with Spotify
2. The app fetches the user's top tracks
3. The tracks are sent to AWS Lambda via API Gateway
4. Lambda uses AWS Bedrock with Claude 3.7 Sonnet to analyze the tracks
5. The personality analysis is returned to the frontend
6. The frontend displays the analysis and the user's top tracks

## Technologies Used

- React + Vite
- Chakra UI
- Spotify Web API
- AWS Lambda
- AWS API Gateway
- AWS Bedrock with Claude 3.7 Sonnet