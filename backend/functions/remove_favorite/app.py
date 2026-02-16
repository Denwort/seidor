"""Lambda function to delete a favorite character"""
import json
from response_utils import success_response, error_response
from db_utils import execute_query, execute_delete

def lambda_handler(event, context):
    """
    DELETE /favorites/{characterId}
    Deletes a favorite character by character ID
    """
    try:
        # Get character ID from path parameters
        character_id = event.get('pathParameters', {}).get('characterId')
        
        if not character_id:
            return error_response('characterId is required', 400)
        
        # Check if favorite exists
        check_query = "SELECT id FROM favorites WHERE character_id = %s"
        existing = execute_query(check_query, (character_id,))
        
        if not existing:
            return error_response('Favorite not found', 404)
        
        # Delete the favorite
        delete_query = "DELETE FROM favorites WHERE character_id = %s"
        execute_delete(delete_query, (character_id,))
        
        return success_response(
            {'characterId': character_id},
            200,
            'Favorite removed successfully'
        )
        
    except Exception as e:
        print(f"Error in delete_favorite: {e}")
        return error_response(str(e), 500)
