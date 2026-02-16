"""HTTP response utilities"""
import json

CORS_HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'
}

def success_response(data, status_code=200, message=None):
    """Return successful response"""
    body = {
        'success': True,
        'data': data
    }
    if message:
        body['message'] = message
    
    return {
        'statusCode': status_code,
        'headers': CORS_HEADERS,
        'body': json.dumps(body)
    }

def error_response(error, status_code=500):
    """Return error response"""
    return {
        'statusCode': status_code,
        'headers': CORS_HEADERS,
        'body': json.dumps({
            'success': False,
            'error': str(error)
        })
    }
