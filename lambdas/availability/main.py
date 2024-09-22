import json
import os
import jwt
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
users_table = dynamodb.Table('pennapps-user-table')
meetings_table = dynamodb.Table('pennapps-meeting-table')
joins_table = dynamodb.Table('pennapps-user-meeting-table')

def lambda_handler(event, context):
    print(event)

    allowedOrigins = ["http://localhost:5173", "https://main.d3gd132ioj1egw.amplifyapp.com"]
    allowOrigin = 'http://localhost:5173'
    if 'headers' in event and event['headers'] is not None:
        headers_lower = {k.lower(): v for k, v in event['headers'].items()}
        origin = headers_lower.get('origin')
        if origin and origin in allowedOrigins:
            allowOrigin = origin


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
            return get_available(event, headers)
        elif http_method == 'POST':
            return post_available(event, headers)
        elif http_method == 'DELETE':
            return delete_available(event, headers)
        else:
            return {
                'headers': headers,
                'statusCode': 405,
                'body': json.dumps('Method Not Allowed')
            }
    except Exception as e:
        print("SOMETHING WENT WRONG...")
        raise e

def get_available(event, headers):
    auth_token = event['headers']['Authorization']
    user = get_user_from_token(auth_token)

    query_params = event.get('queryStringParameters', {})
    meeting_id = query_params.get('meeting_id')

    if not meeting_id:
        return {
            'headers': headers,
            'statusCode': 404,
            'body': json.dumps({
                'message': 'message_id required'
            })
        }

    joins = joins_table.query(
        IndexName='MeetingIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('meeting_id').eq(meeting_id)
    )

    shares = joins.get('Items', [])

    availability = []

    for share in shares:
        available_list = share.get('available', [])
        for slot in available_list:
            availability.append({
                "user_id": share.user_id,
                "day": slot[0],
                "start_time": slot[1],
                "end_time": slot[2]
            })

    return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(availability)
        }

def post_available(event, headers):
    auth_token = event['headers']['Authorization']    
    user = get_user_from_token(auth_token)
    body = json.loads(event['body'])

    day = body['day']
    start_time = body['start_time']
    end_time = body['end_time']

    meeting_id = body['meeting_id']

    joins = joins_table.query(
        IndexName='MeetingIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('meeting_id').eq(meeting_id)
    )

    join_id = ''
    for join in joins:
        if join.user_id == user.id:
            join_id = join.join_id
            break  

    if join_id == '':
        return {
            'headers': headers,
            'statusCode': 401,
            'body': json.dumps({"message": "not shared with you"})
        }

    response = joins_table.get_item(
        Key={
            'join_id': join_id
        }
    )
    
    # Check if the item exists
    item = response.get('Item')
    
    if item:
        # Get the existing 'available' list or initialize an empty one
        available_list = item.get('available', [])
        
        # Create the new entry
        new_entry = [day, start_time, end_time]
        
        # Append the new entry to the available list
        available_list.append(new_entry)
        
        # Update the item in DynamoDB with the new 'available' list
        joins.update_item(
            Key={
                'join_id': join_id
            },
            UpdateExpression="SET available = :available_list",
            ExpressionAttributeValues={
                ':available_list': available_list
            }
        )
        
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps({"message": "successfully added"})
        }
    
    else:

        return {
            'headers': headers,
            'statusCode': 400,
            'body': json.dumps({"message": 'failed to add'})
        }
  

def delete_available(event, headers):
    auth_token = event['headers']['Authorization']
    user = get_user_from_token(auth_token)

    body = json.loads(event['body'])
    day = body['day']
    start_time = body['start_time']
    end_time = body['end_time']

    meeting_id = body['meeting_id']

    joins = joins_table.query(
        IndexName='MeetingIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('meeting_id').eq(meeting_id)
    )

    join_id = ''
    for join in joins:
        if join.user_id == user.id:
            join_id = join.join_id
            break  

    if join_id == '':
        return {
            'headers': headers,
            'statusCode': 401,
            'body': json.dumps({"message": "not shared with you"})
        }

    response = joins_table.get_item(
        Key={
            'join_id': join_id
        }
    )
    
    # Check if the item exists
    item = response.get('Item')
    
    if item:
        # Get the existing 'available' list or initialize an empty one
        available_list = item.get('available', [])
        
        # Create the new entry
        available_list = [l for l in available_list if (l[0] != day or l[1] != start_time or l[2] != end_time)]
        
        # Update the item in DynamoDB with the new 'available' list
        joins.update_item(
            Key={
                'join_id': join_id
            },
            UpdateExpression="SET available = :available_list",
            ExpressionAttributeValues={
                ':available_list': available_list
            }
        )
        
        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps({"message": "successfully added"})
        }
    
    else:

        return {
            'headers': headers,
            'statusCode': 400,
            'body': json.dumps({"message": 'failed to add'})
        }
    


def get_user_from_token(token):
    decoded_token = decode_jwt_token(token)

    if 'email' not in decoded_token:
        raise Exception("Not logged in")

    email = decoded_token['email']

    response = get_json_from_email(email)

    if 'Items' in response and len(response['Items']) > 0:
        return response['Items'][0]
    else:
        raise Exception('User not found')

def get_json_from_email(email):
    return users_table.query(
        IndexName='EmailIndex',
        KeyConditionExpression=boto3.dynamodb.conditions.Key('email').eq(email)
    )

def decode_jwt_token(token):    
    if token.startswith('Bearer '):
        token = token[len('Bearer '):]

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
