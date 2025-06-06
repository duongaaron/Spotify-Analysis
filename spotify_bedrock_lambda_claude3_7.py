import json
import os
import boto3
import base64
import requests
from urllib.parse import urlencode

def get_spotify_access_token(auth_code, redirect_uri):
    """Exchange authorization code for access token"""
    client_id = os.environ.get('SPOTIFY_CLIENT_ID')
    client_secret = os.environ.get('SPOTIFY_CLIENT_SECRET')
    
    auth_header = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    
    headers = {
        'Authorization': f'Basic {auth_header}',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    
    data = {
        'grant_type': 'authorization_code',
        'code': auth_code,
        'redirect_uri': redirect_uri
    }
    
    response = requests.post('https://accounts.spotify.com/api/token', headers=headers, data=data)
    
    if response.status_code != 200:
        raise Exception(f"Failed to get access token: {response.text}")
    
    return response.json()['access_token']

def get_spotify_top_tracks(access_token, time_range='medium_term', limit=50):
    """Fetch user's top tracks from Spotify"""
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    params = {
        'time_range': time_range,
        'limit': limit
    }
    
    response = requests.get(
        'https://api.spotify.com/v1/me/top/tracks', 
        headers=headers, 
        params=params
    )
    
    if response.status_code != 200:
        raise Exception(f"Failed to get top tracks: {response.text}")
    
    tracks = response.json()['items']
    
    # Format track data for analysis
    formatted_tracks = []
    for track in tracks:
        formatted_tracks.append({
            'name': track['name'],
            'artist': track['artists'][0]['name'],
            'album': track['album']['name'],
            'popularity': track['popularity']
        })
    
    return formatted_tracks

def analyze_personality_with_bedrock(tracks):
    """Use Amazon Bedrock to analyze personality based on music taste"""
    bedrock_runtime = boto3.client('bedrock-runtime')
    
    # Format the prompt for Bedrock
    track_list = "\n".join([f"- {track['name']} by {track['artist']} (Album: {track['album']}, Popularity: {track['popularity']})" 
                        for track in tracks[:20]])  # Limit to 20 tracks to avoid token limits
    
    prompt = f"""Based on the following list of a person's top Spotify tracks, analyze their personality, 
music taste, and provide insights about their character. Be creative, insightful, and specific.

Top Tracks:
{track_list}

Please provide:
1. A personality profile (3-4 paragraphs)
2. Key personality traits (5-7 bullet points)
3. Music taste analysis
4. A fun, creative title for their personality type"""
    
    # Call Claude 3.7 Sonnet model with the correct format
    response = bedrock_runtime.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        contentType="application/json",
        accept="application/json",
        body=json.dumps({
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": 1000,
            "top_k": 250,
            "stop_sequences": [],
            "temperature": 0.7,
            "top_p": 0.999,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": prompt
                        }
                    ]
                }
            ]
        })
    )
    
    response_body = json.loads(response['body'].read().decode())
    
    # Extract the analysis from the response
    if 'content' in response_body and len(response_body['content']) > 0:
        analysis = response_body['content'][0]['text']
        return analysis
    else:
        raise Exception("Unexpected response format from Bedrock")

def lambda_handler(event, context):
    try:
        # Check if this is a new authorization or using an existing token
        if 'queryStringParameters' in event and event['queryStringParameters'] and 'code' in event['queryStringParameters']:
            # New authorization flow
            auth_code = event['queryStringParameters']['code']
            redirect_uri = os.environ.get('REDIRECT_URI')
            
            # Exchange auth code for access token
            access_token = get_spotify_access_token(auth_code, redirect_uri)
            
            # Get top tracks
            tracks = get_spotify_top_tracks(access_token)
            
        elif 'body' in event and event['body']:
            # Using existing token passed in request body
            body = json.loads(event['body'])
            access_token = body.get('access_token')
            
            if not access_token:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'error': 'Access token is required'})
                }
            
            # Get top tracks
            time_range = body.get('time_range', 'medium_term')
            tracks = get_spotify_top_tracks(access_token, time_range)
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing required parameters'})
            }
        
        # Analyze personality using Bedrock
        personality_analysis = analyze_personality_with_bedrock(tracks)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'  # For CORS support
            },
            'body': json.dumps({
                'tracks': tracks,
                'personality_analysis': personality_analysis
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
