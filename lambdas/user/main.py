import json
import os
import jwt
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('pennapps-user-table')

def lambda_handler(event, context):
    print(event)

    allowedOrigins = ["http://localhost:5173", "https://main.d3gd132ioj1egw.amplifyapp.com"]
    allowOrigin = '' 
    if 'headers' in event and event['headers'] is not None and 'Origin' in event['headers']:
        allowOrigin = event['headers']['Origin'] if event['headers']['Origin'] in allowedOrigins else ''

    headers = {
        'Access-Control-Allow-Origin': allowOrigin, 
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': 'true'
    }
    try:
        if 'httpMethod' not in event:
            return {
                'headers': headers,
                'statusCode': 405,
                'body': json.dumps('Method Not Allowed')
            }
        
        http_method = event['httpMethod']

        if http_method == 'GET':
            if 'Authorization' in event['headers']:
                return get_user_private(event, headers)
            else:
                return get_user_public(event, headers)
        elif http_method == 'PUT':
            return put_user(event, headers)
        else:
            return {
                'headers': headers,
                'statusCode': 405,
                'body': json.dumps('Method Not Allowed')
            }
    except Exception as e:
        print(e)
        return {
                'headers': headers,
                'statusCode': 500,
                'body': json.dumps('Something Went Wrong...')
            }

def get_user_private(event, headers):
    auth_token = event['headers']['Authorization']
    decoded_token = decode_jwt_token(auth_token)

    if 'email' not in decoded_token:
        return {            
            'headers': headers,
            'statusCode': 401,
            'body': json.dumps({'message': 'Unauthorized - email not found in token'})
        }

    email = decoded_token['email']

    response = get_json_from_email(email)

    if 'Item' in response:
        user = response['Item']
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(user)
        }

    new_user = {
        'email': email,
        'username': email,
        'profile_pic': '',
        'meetings': [],
        'user_id': str(uuid.uuid4())
    }

    users_table.put_item(Item=new_user)

    return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(new_user)
        }

def get_user_public(event, headers):
    query_params = event.get('queryStringParameters', {})
    user_id = query_params.get('user_id')
    
    if not user_id:
        return {
            'headers': headers,
            'statusCode': 400,
            'body': json.dumps({'message': 'Bad Request - ID is required'})
        }
    
    # Check if user exists in DynamoDB
    response = users_table.get_item(Key={'user_id': user_id})
    
    if 'Item' not in response:
        return {
            'headers': headers,
            'statusCode': 404,
            'body': json.dumps({'message': 'User not found'})
        }
    
    user = response['Item']
    return {
        'headers': headers,
        'statusCode': 200,
        'body': json.dumps({
            'username': user['username'],
            'profile_pic': user.get('profile_pic', '')
        })
    }

def put_user(event, headers):
    auth_token = event['headers']['Authorization']
    decoded_token = decode_jwt_token(auth_token)

    if 'email' not in decoded_token:
        return {
            'headers': headers,
            'statusCode': 401,
            'body': json.dumps({'message': 'Unauthorized - email not found in token'})
        }

    email = decoded_token['email']

    response = get_json_from_email(email)

    if 'Item' not in response:
        return {
            'headers': headers,
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
        Key={'user_id': {'S': user['user_id']}},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values)
    
    return {
        'headers': headers,
        'statusCode': 200,
        'body': json.dumps('User updated successfully')
    }

def get_json_from_email(email):
    return users_table.query(
        IndexName='EmailIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
    )

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
