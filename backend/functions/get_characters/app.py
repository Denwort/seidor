"""Lambda function to get characters from SWAPI (excluding favorites)"""
import json
from response_utils import success_response, error_response
from swapi_utils import search_characters
from db_utils import execute_query

def lambda_handler(event, context):
    """
    GET /characters
    Query params: search (optional)
    Returns: List of characters from SWAPI excluding favorites
    """
    try:
        # Get search parameter
        search_term = None
        if event.get('queryStringParameters'):
            search_term = event['queryStringParameters'].get('search')
        
        # Fetch characters from SWAPI
        characters = search_characters(search_term)
        
        # Get favorite character IDs from database
        query = "SELECT character_id FROM favorites"
        favorite_rows = execute_query(query)
        favorite_ids = {row['character_id'] for row in favorite_rows}
        
        # Filter out favorites
        available_characters = [
            char for char in characters 
            if char['id'] not in favorite_ids
        ]
        
        return success_response({
            'characters': available_characters,
            'total': len(available_characters)
        })
        
    except Exception as e:
        print(f"Error in get_characters: {e}")
        return error_response(str(e), 500)
