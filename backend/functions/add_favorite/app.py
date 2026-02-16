"""Lambda function to add character to favorites"""
import json
from response_utils import success_response, error_response
from swapi_utils import get_character_by_id
from db_utils import execute_insert, execute_query
from datetime import datetime

def lambda_handler(event, context):
    """
    POST /favorites
    Body: { "characterId": "1" }
    Returns: Created favorite character
    """
    try:
        # Parse request body
        if not event.get('body'):
            return error_response('Request body is required', 400)
        
        body = json.loads(event['body'])
        character_id = body.get('characterId')
        
        if not character_id:
            return error_response('characterId is required', 400)
        
        # Check if already exists
        check_query = "SELECT id FROM favorites WHERE character_id = %s"
        existing = execute_query(check_query, (character_id,))
        
        if existing:
            return error_response('Character is already in favorites', 400)
        
        # Fetch character from SWAPI
        character = get_character_by_id(character_id)
        
        if not character:
            return error_response('Character not found in SWAPI', 404)
        
        # Insert into database
        insert_query = """
            INSERT INTO favorites 
            (character_id, name, height, mass, hair_color, skin_color, 
             eye_color, birth_year, gender)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        params = (
            character['id'],
            character['name'],
            character['height'],
            character['mass'],
            character['hairColor'],
            character['skinColor'],
            character['eyeColor'],
            character['birthYear'],
            character['gender']
        )
        
        favorite_id = execute_insert(insert_query, params)
        
        # Return created favorite
        favorite = {
            **character,
            'favoriteId': favorite_id,
            'addedAt': datetime.now().isoformat()
        }
        
        return success_response(
            favorite, 
            201, 
            'Character added to favorites successfully'
        )
        
    except json.JSONDecodeError:
        return error_response('Invalid JSON in request body', 400)
    except Exception as e:
        print(f"Error in add_favorite: {e}")
        return error_response(str(e), 500)
