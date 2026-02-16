"""SWAPI integration utilities"""
import requests

SWAPI_BASE_URL = 'https://swapi.dev/api'

def search_characters(search_term=None):
    """Search characters from SWAPI"""
    url = f"{SWAPI_BASE_URL}/people/"
    params = {"search": search_term} if search_term else {}
    
    response = requests.get(url, params=params, timeout=10)
    response.raise_for_status()
    
    data = response.json()
    return [transform_character(char) for char in data['results']]

def get_character_by_id(character_id):
    """Get specific character from SWAPI"""
    url = f"{SWAPI_BASE_URL}/people/{character_id}/"
    
    response = requests.get(url, timeout=10)
    if response.status_code == 404:
        return None
    response.raise_for_status()
    
    return transform_character(response.json())

def transform_character(swapi_char):
    """Transform SWAPI character to normalized format"""
    # Extract ID from URL
    character_id = swapi_char['url'].rstrip('/').split('/')[-1]
    
    return {
        'id': character_id,
        'name': swapi_char['name'],
        'height': swapi_char['height'],
        'mass': swapi_char['mass'],
        'hairColor': swapi_char['hair_color'],
        'skinColor': swapi_char['skin_color'],
        'eyeColor': swapi_char['eye_color'],
        'birthYear': swapi_char['birth_year'],
        'gender': swapi_char['gender']
    }
