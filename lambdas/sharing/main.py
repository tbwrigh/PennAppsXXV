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
            return get_sharing(event, headers)
        elif http_method == 'PUT':
            return put_sharing(event, headers)
        elif http_method == 'DELETE':
            return delete_sharing(event, headers)
        else:
            return {
                'headers': headers,
                'statusCode': 405,
                'body': json.dumps('Method Not Allowed')
            }
    except Exception as e:
        print("SOMETHING WENT WRONG...")
        raise e
    

def get_sharing(event, headers):
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

    user_ids = [join['user_id'] for join in joins['Items']]

    response = users_table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('user_id').is_in(user_ids)
    )

    meetings = response.get('Items', [])

    return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps(meetings)
        }
  

def put_sharing(event, headers):
    auth_token = event['headers']['Authorization']    
    user = get_user_from_token(auth_token)
    
    body = json.loads(event['body'])

    meeting_id = body['meeting_id']
    user_id = body['user_id']


    meeting = meetings_table.get_item(Key={'meeting_id': meeting_id})

    if "Item" not in meeting:
        return {
            'headers': headers,
            'statusCode': 404,
            'body': json.dumps({"message": "meeting not found"})
        }

    if user['user_id'] != meeting['Item'].get("owner"):
        return {
            'headers': headers,
            'statusCode': 401,
            'body': json.dumps({"message": "you're not the owner"})
        }

    try:
        response2 = joins_table.put_item(
        Item = {
            'join_id': str(uuid.uuid4()),
            'user_id': user_id,
            'meeting_id': meeting_id
            }
        )

        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Meeting successfully shared',
            })
        }
    except Exception as e:
        return {
            'headers': headers,
            'statusCode': 500,
            'body': json.dumps({
                'message': str(e)
            })
        }

def delete_sharing(event, headers):
    auth_token = event['headers']['Authorization']
    user = get_user_from_token(auth_token)

    body = json.loads(event['body'])

    meeting_id = body['meeting_id']
    user_id = body['user_id']

    meeting = meetings_table.get_item(Key={'meeting_id': meeting_id})

    if "Item" not in meeting:
        return {
            'headers': headers,
            'statusCode': 404,
            'body': json.dumps({"message": "meeting not found"})
        }

    if user['user_id'] != meeting['Item'].get("owner"):
        return {
            'headers': headers,
            'statusCode': 401,
            'body': json.dumps({"message": "you're not the owner"})
        }
    
    try:
        joins = joins_table.query(
            IndexName='MeetingIndex',
            KeyConditionExpression=boto3.dynamodb.conditions.Key('meeting_id').eq(meeting_id)
        )

        if "Items" in joins:
            for join in joins['Items']:
                if join['user_id'] == user_id:
                    joins_table.delete_item(
                        Key={'join_id': join['join_id']},
                        ConditionExpression="attribute_exists(join_id)"
                    )

        return {
            'headers': headers,
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Meeting successfully unshared'
            })
        }
    except Exception as e:
        return {
            'headers': headers,
            'statusCode': 500,
            'body': json.dumps({
                'message': str(e)
            })
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
