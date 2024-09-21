import json
import os
import jwt
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('pennapps-user-table')

def lambda_handler(event, context):
    if 'httpMethod' not in event:
        return {
            'statusCode': 405,
            'body': json.dumps('Method Not Allowed')
        }
    
    http_method = event['httpMethod']

    if http_method == 'GET':
        if 'Authorization' in event['headers']:
            return get_user_private(event)
        else:
            return get_user_public(event)
    elif http_method == 'PUT':
        return put_user(event)
    else:
        return {
            'statusCode': 405,
            'body': json.dumps('Method Not Allowed')
        }

def get_user_private(event):
    auth_token = event['headers']['Authorization']
    decoded_token = decode_jwt_token(auth_token)

    if 'email' not in decoded_token:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Unauthorized - email not found in token'})
        }

    email = decoded_token['email']

    response = users_table.get_item(Key={'email': email})

    if 'Item' in response:
        user = response['Item']
        return {
            'statusCode': 200,
            'body': json.dumps(user)
        }

    new_user = {
        'email': email,
        'username': email,
        'profile_pic': '',
        'meetings': [],
        'id': str(uuid.uuid4())
    }

    users_table.put_item(Item=new_user)

    return {
            'statusCode': 200,
            'body': json.dumps(new_user)
        }

def get_user_public(event):
    query_params = event.get('queryStringParameters', {})
    user_id = query_params.get('id')
    
    if not user_id:
        return {
            'statusCode': 400,
            'body': json.dumps({'message': 'Bad Request - ID is required'})
        }
    
    # Check if user exists in DynamoDB
    response = users_table.get_item(Key={'id': user_id})
    
    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'User not found'})
        }
    
    user = response['Item']
    return {
        'statusCode': 200,
        'body': json.dumps({
            'username': user['username'],
            'profile_pic': user.get('profile_pic', '')
        })
    }

def put_user(event):
    auth_token = event['headers']['Authorization']
    decoded_token = decode_jwt_token(auth_token)

    if 'email' not in decoded_token:
        return {
            'statusCode': 401,
            'body': json.dumps({'message': 'Unauthorized - email not found in token'})
        }

    email = decoded_token['email']

    response = users_table.get_item(Key={'email': email})

    if 'Item' not in response:
        return {
            'statusCode': 404,
            'body': json.dumps({'message': 'User not found'})
        }
    
    user = response['Item']
    
    body = json.loads(event['body'])

    update_expression = "SET "
    expression_attribute_values = {}

    if 'username' in body:
        update_expression += "username = :u,"
        expression_attribute_values[':u'] = {'S': body['username']}
    
    update_expression = update_expression.rstrip(',')
    dynamodb.update_item(
        TableName=users_table,
        Key={'user_id': {'S': user['id']}},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values)
    
    return {
        'statusCode': 200,
        'body': json.dumps('User updated successfully')
    }

def decode_jwt_token(token):
    header = jwt.get_unverified_header(token)
    
    # Replace this with the actual public key URL for your Cognito pool
    jwks_url = os.environ['COGNITO_JWKS_URL']

    # Fetch the public key and decode the token
    jwks_client = jwt.PyJWKClient(jwks_url)
    signing_key = jwks_client.get_signing_key_from_jwt(token)
    
    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience=os.environ['COGNITO_APP_CLIENT_ID'],
        options={"verify_exp": True}
    )
    
    return payload
