provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "user_profile_bucket" {
  bucket = "pennapps-profile-picture-bucket"

  # Prevent the bucket from being destroyed
  lifecycle {
    prevent_destroy = true
  }
}

# DynamoDB table for user information
resource "aws_dynamodb_table" "user_table" {
  name         = "pennapps-user-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"

  attribute {
    name = "user_id"
    type = "S"
  }
}

# IAM Role for Lambda Execution
resource "aws_iam_role" "lambda_execution_role" {
  name = "pennapps_lambda_execution_role"
  assume_role_policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  })
}

# IAM Policy with attached permissions for DynamoDB and S3
resource "aws_iam_policy" "lambda_dynamodb_s3_policy" {
  name = "lambda_dynamodb_s3_policy"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "s3:GetObject",
          "s3:PutObject"
        ],
        "Resource": [
          aws_dynamodb_table.user_table.arn,
          aws_s3_bucket.user_profile_bucket.arn
        ]
      }
    ]
  })
}

# Attach the policy to the Lambda execution role
resource "aws_iam_role_policy_attachment" "lambda_execution_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_s3_policy.arn
}

resource "aws_lambda_layer_version" "pyjwt_layer" {
  layer_name          = "pkgs"
  filename            = "${path.module}/../lambdas/layers/pkgs/pkgs.zip"
  compatible_runtimes = ["python3.12"]
  source_code_hash    = filebase64sha256("${path.module}/../lambdas/layers/pkgs/pkgs.zip")
}

# Generate Lambda function zip from source
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambdas/user"
  output_path = "${path.module}/zips/user.zip"
}

# Lambda Function for User Profile
resource "aws_lambda_function" "user_profile_lambda" {
  function_name = "user-profile-handler"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "main.lambda_handler"
  runtime       = "python3.12"
  timeout       = 15
  memory_size   = 128

  filename      = data.archive_file.lambda_zip.output_path

  layers        = [aws_lambda_layer_version.pyjwt_layer.arn]
}

# Import the existing Cognito User Pool created by Amplify
data "aws_cognito_user_pool" "amplify_user_pool" {
  user_pool_id = "us-east-1_uw33uGxTn"
}

# API Gateway for Lambda
resource "aws_api_gateway_rest_api" "user_api" {
  name        = "UserAPI"
  description = "API to handle user profile (GET, PUT)."
}

# /user resource (both public and authenticated GET)
resource "aws_api_gateway_resource" "user" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  parent_id   = aws_api_gateway_rest_api.user_api.root_resource_id
  path_part   = "user"
}

# Cognito Authorizer for PUT method
resource "aws_api_gateway_authorizer" "cognito_authorizer" {
  name            = "CognitoAuthorizer"
  rest_api_id     = aws_api_gateway_rest_api.user_api.id
  type            = "COGNITO_USER_POOLS"  # Specify the correct authorizer type
  identity_source = "method.request.header.Authorization"
  provider_arns   = [data.aws_cognito_user_pool.amplify_user_pool.arn]  # Reference to the Cognito User Pool
}

# Single GET method on /user
resource "aws_api_gateway_method" "get_user" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "GET"
  authorization = "NONE"  # No authorization for public GET

  # Allow an optional 'public' query parameter
  request_parameters = {
    "method.request.querystring.public": false
  }
}

# PUT method now requires Cognito User Pool authentication
resource "aws_api_gateway_method" "put_user" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "PUT"
  authorization = "COGNITO_USER_POOLS"   # Require Cognito User Pool authorization
  authorizer_id = aws_api_gateway_authorizer.cognito_authorizer.id
}

# API Gateway Integration for GET method
resource "aws_api_gateway_integration" "get_user_integration" {
  rest_api_id             = aws_api_gateway_rest_api.user_api.id
  resource_id             = aws_api_gateway_resource.user.id
  http_method             = aws_api_gateway_method.get_user.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_profile_lambda.invoke_arn
}

# API Gateway Integration for PUT method
resource "aws_api_gateway_integration" "put_user_integration" {
  rest_api_id             = aws_api_gateway_rest_api.user_api.id
  resource_id             = aws_api_gateway_resource.user.id
  http_method             = aws_api_gateway_method.put_user.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.user_profile_lambda.invoke_arn
}

# Permission to allow API Gateway to invoke Lambda
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_profile_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_api.execution_arn}/*/*"
}

output "api_url" {
  value = "${aws_api_gateway_rest_api.user_api.execution_arn}/user"
}
