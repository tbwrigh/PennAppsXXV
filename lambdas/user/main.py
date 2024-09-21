import json
import boto3
import os

dynamodb = boto3.client('dynamodb')
s3 = boto3.client('s3')

USER_TABLE = os.getenv('USER_TABLE')
PROFILE_PIC_BUCKET = os.getenv('PROFILE_PIC_BUCKET')

def lambda_handler(event, context):
    http_method = event['httpMethod']
    
    if http_method == 'GET':
        return get_user(event)
    elif http_method == 'PUT':
        return put_user(event)
    else:
        return {
            'statusCode': 405,
            'body': json.dumps('Method Not Allowed')
        }

def get_user(event):
    user_id = event['queryStringParameters']['user_id']
    
    # Get user data from DynamoDB
    dynamo_response = dynamodb.get_item(
        TableName=USER_TABLE,
        Key={'user_id': {'S': user_id}}
    )
    
    if 'Item' not in dynamo_response:
        return {
            'statusCode': 404,
            'body': json.dumps('User not found')
        }
    
    user_data = dynamo_response['Item']
    username = user_data['username']['S']
    
    # Get profile picture URL from S3
    profile_pic_key = user_data['profile_pic_key']['S']
    profile_pic_url = s3.generate_presigned_url(
        'get_object',
        Params={'Bucket': PROFILE_PIC_BUCKET, 'Key': profile_pic_key},
        ExpiresIn=3600
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps({
            'username': username,
            'profile_pic_url': profile_pic_url
        })
    }

def put_user(event):
    body = json.loads(event['body'])
    user_id = body['user_id']
    
    update_expression = "SET "
    expression_attribute_values = {}
    
    if 'username' in body:
        update_expression += "username = :u,"
        expression_attribute_values[':u'] = {'S': body['username']}
    
    if 'profile_pic' in body:
        profile_pic_key = f"{user_id}/profile_pic.jpg"
        s3.put_object(
            Bucket=PROFILE_PIC_BUCKET,
            Key=profile_pic_key,
            Body=body['profile_pic']
        )
        update_expression += "profile_pic_key = :p,"
        expression_attribute_values[':p'] = {'S': profile_pic_key}
    
    # Remove the trailing comma
    update_expression = update_expression.rstrip(',')
    
    dynamodb.update_item(
        TableName=USER_TABLE,
        Key={'user_id': {'S': user_id}},
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_attribute_values
    )
    
    return {
        'statusCode': 200,
        'body': json.dumps('User updated successfully')
    }
