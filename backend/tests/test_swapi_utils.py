"""
Tests for SWAPI utilities
"""
import sys
import os

# Add layers to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../layers/common/python'))

from swapi_utils import transform_character

def test_transform_character():
    """Test character transformation from SWAPI format"""
    swapi_data = {
        'name': 'Luke Skywalker',
        'height': '172',
        'mass': '77',
        'hair_color': 'blond',
        'skin_color': 'fair',
        'eye_color': 'blue',
        'birth_year': '19BBY',
        'gender': 'male',
        'url': 'https://swapi.py4e.com/api/people/1/'
    }
    
    result = transform_character(swapi_data)
    
    assert result['id'] == '1'
    assert result['name'] == 'Luke Skywalker'
    assert result['height'] == '172'
    assert result['mass'] == '77'
    assert result['hairColor'] == 'blond'
    assert result['skinColor'] == 'fair'
    assert result['eyeColor'] == 'blue'
    assert result['birthYear'] == '19BBY'
    assert result['gender'] == 'male'

def test_transform_character_extracts_id_from_url():
    """Test that character ID is correctly extracted from URL"""
    swapi_data = {
        'name': 'Darth Vader',
        'height': '202',
        'mass': '136',
        'hair_color': 'none',
        'skin_color': 'white',
        'eye_color': 'yellow',
        'birth_year': '41.9BBY',
        'gender': 'male',
        'url': 'https://swapi.py4e.com/api/people/4/'
    }
    
    result = transform_character(swapi_data)
    
    assert result['id'] == '4'
