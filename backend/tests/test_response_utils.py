"""
Tests for response utilities
"""
import sys
import os
import json

# Add layers to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../layers/common'))

from response_utils import success_response, error_response

def test_success_response_basic():
    """Test basic success response"""
    data = {'name': 'Luke Skywalker', 'id': '1'}
    result = success_response(data)
    
    assert result['statusCode'] == 200
    assert 'headers' in result
    assert result['headers']['Content-Type'] == 'application/json'
    
    body = json.loads(result['body'])
    assert body['success'] is True
    assert body['data'] == data

def test_success_response_with_message():
    """Test success response with custom message"""
    data = {'id': '1'}
    message = 'Operation completed successfully'
    result = success_response(data, message=message)
    
    body = json.loads(result['body'])
    assert body['success'] is True
    assert body['message'] == message

def test_success_response_custom_status():
    """Test success response with custom status code"""
    data = {'id': '1'}
    result = success_response(data, status_code=201)
    
    assert result['statusCode'] == 201

def test_error_response_basic():
    """Test basic error response"""
    error = 'Something went wrong'
    result = error_response(error)
    
    assert result['statusCode'] == 500
    assert 'headers' in result
    
    body = json.loads(result['body'])
    assert body['success'] is False
    assert body['error'] == error

def test_error_response_custom_status():
    """Test error response with custom status code"""
    error = 'Not found'
    result = error_response(error, status_code=404)
    
    assert result['statusCode'] == 404
    
    body = json.loads(result['body'])
    assert body['error'] == error

def test_response_has_cors_headers():
    """Test that responses include CORS headers"""
    result = success_response({'data': 'test'})
    
    assert 'Access-Control-Allow-Origin' in result['headers']
    assert result['headers']['Access-Control-Allow-Origin'] == '*'
    assert 'Access-Control-Allow-Headers' in result['headers']
    assert 'Access-Control-Allow-Methods' in result['headers']
