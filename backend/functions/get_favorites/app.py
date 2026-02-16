"""Lambda function to get paginated favorites"""
import json
from response_utils import success_response, error_response
from db_utils import execute_query
import math

def lambda_handler(event, context):
    """
    GET /favorites
    Query params: page (default: 1), pageSize (default: 3)
    Returns: Paginated list of favorite characters
    """
    try:
        # Parse pagination parameters
        page = 1
        page_size = 3
        
        if event.get('queryStringParameters'):
            params = event['queryStringParameters']
            
            if params.get('page'):
                page = int(params['page'])
                if page < 1:
                    return error_response('Invalid page parameter', 400)
            
            if params.get('pageSize'):
                page_size = int(params['pageSize'])
                if page_size < 1 or page_size > 100:
                    return error_response(
                        'Invalid pageSize parameter (must be between 1 and 100)', 
                        400
                    )
        
        # Calculate offset
        offset = (page - 1) * page_size
        
        # Get total count
        count_query = "SELECT COUNT(*) as total FROM favorites"
        count_result = execute_query(count_query)
        total = count_result[0]['total']
        
        # Get paginated data
        data_query = """
            SELECT 
                id as favoriteId,
                character_id as id,
                name,
                height,
                mass,
                hair_color as hairColor,
                skin_color as skinColor,
                eye_color as eyeColor,
                birth_year as birthYear,
                gender,
                created_at as addedAt
            FROM favorites
            ORDER BY created_at DESC
            LIMIT %s OFFSET %s
        """
        
        favorites = execute_query(data_query, (page_size, offset))
        
        # Format dates
        for fav in favorites:
            if fav['addedAt']:
                fav['addedAt'] = fav['addedAt'].isoformat()
        
        # Build response
        result = {
            'data': favorites,
            'pagination': {
                'page': page,
                'pageSize': page_size,
                'total': total,
                'totalPages': math.ceil(total / page_size) if total > 0 else 0
            }
        }
        
        return success_response(result)
        
    except ValueError:
        return error_response('Invalid pagination parameters', 400)
    except Exception as e:
        print(f"Error in get_favorites: {e}")
        return error_response(str(e), 500)
