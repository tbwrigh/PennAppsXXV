provider "aws" {
  region = "us-east-1"
}

# Import the existing Cognito User Pool created by Amplify
data "aws_cognito_user_pool" "amplify_user_pool" {
  user_pool_id = "us-east-1_uw33uGxTn"
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

  attribute {
    name = "email"
    type = "S"
  }

  global_secondary_index {
    name            = "EmailIndex"
    hash_key        = "email"
    projection_type = "ALL"
  }

  tags = {
    Name = "UserTable"
  }
}

resource "aws_dynamodb_table" "meeting_table" {
  name         = "pennapps-meeting-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "meeting_id"

  attribute {
    name = "meeting_id"
    type = "S"
  }

  tags = {
    Name = "MeetingTable"
  }
}

resource "aws_dynamodb_table" "user_meeting_table" {
  name         = "pennapps-user-meeting-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "join_id"

  attribute {
    name = "join_id"
    type = "S"
  }

  attribute {
    name = "user_id"
    type = "S"
  }

   attribute {
    name = "meeting_id"
    type = "S"
  }

  global_secondary_index {
    name            = "UserIndex"
    hash_key        = "user_id"
    projection_type = "ALL"
  }

  global_secondary_index {
    name            = "MeetingIndex"
    hash_key        = "meeting_id"
    projection_type = "ALL"
  }

  tags = {
    Name = "JoinTable"
  }
}

# IAM Role for Lambda Execution
resource "aws_iam_role" "lambda_execution_role" {
  name = "pennapps_lambda_execution_role"
  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Action" : "sts:AssumeRole",
        "Principal" : {
          "Service" : "lambda.amazonaws.com"
        },
        "Effect" : "Allow",
        "Sid" : ""
      }
    ]
  })
}

# IAM Policy with attached permissions for DynamoDB and S3
resource "aws_iam_policy" "lambda_dynamodb_s3_policy" {
  name = "lambda_dynamodb_s3_policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:*",
          "s3:*"
        ],
        "Resource" : [
          aws_dynamodb_table.user_table.arn,
          "${aws_dynamodb_table.user_table.arn}/index/*",
          aws_dynamodb_table.meeting_table.arn,
          "${aws_dynamodb_table.meeting_table.arn}/index/*",
          aws_dynamodb_table.user_meeting_table.arn,
          "${aws_dynamodb_table.user_meeting_table.arn}/index/*",
          "${aws_s3_bucket.user_profile_bucket.arn}/*"
        ]
      }
    ]
  })
}


resource "aws_iam_policy" "lambda_logging_policy" {
  name = "lambda_logging_policy"
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "arn:aws:logs:*:*:*"
      }
    ]
  })
}

# Attach the policies to the Lambda execution role
resource "aws_iam_role_policy_attachment" "lambda_execution_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_dynamodb_s3_policy.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logging_policy_attachment" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = aws_iam_policy.lambda_logging_policy.arn
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

  filename = data.archive_file.lambda_zip.output_path

  layers = [aws_lambda_layer_version.pyjwt_layer.arn]

  environment {
    variables = {
      # "COGNITO_JWKS_URL" = "https://cognito-idp.us-east-1.amazonaws.com/${data.aws_cognito_user_pool.amplify_user_pool.id}/.well-known/jwks.json"
      "COGNITO_JWKS_URL"      = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_03Q4wxd82/.well-known/jwks.json"
      "COGNITO_APP_CLIENT_ID" = "1173v3nt69bv8ujap218nrq2do"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_execution_policy_attachment,
    aws_iam_role_policy_attachment.lambda_logging_policy_attachment
  ]
}

data "archive_file" "meeting_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambdas/meeting"
  output_path = "${path.module}/zips/meeting.zip"
}

# Lambda Function for User Profile
resource "aws_lambda_function" "meeting_lambda" {
  function_name = "meeting-handler"
  role          = aws_iam_role.lambda_execution_role.arn
  handler       = "main.lambda_handler"
  runtime       = "python3.12"
  timeout       = 15
  memory_size   = 128

  filename = data.archive_file.meeting_lambda_zip.output_path

  layers = [aws_lambda_layer_version.pyjwt_layer.arn]

  environment {
    variables = {
      # "COGNITO_JWKS_URL" = "https://cognito-idp.us-east-1.amazonaws.com/${data.aws_cognito_user_pool.amplify_user_pool.id}/.well-known/jwks.json"
      "COGNITO_JWKS_URL"      = "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_03Q4wxd82/.well-known/jwks.json"
      "COGNITO_APP_CLIENT_ID" = "1173v3nt69bv8ujap218nrq2do"
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_execution_policy_attachment,
    aws_iam_role_policy_attachment.lambda_logging_policy_attachment
  ]
}


resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.user_profile_lambda.function_name}"
  retention_in_days = 7
}

resource "aws_cloudwatch_log_group" "lambda_meeting_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.meeting_lambda.function_name}"
  retention_in_days = 7
}

# API Gateway for Lambda
resource "aws_api_gateway_rest_api" "user_api" {
  name        = "UserAPI"
  description = "API to handle user profile (GET, PUT)."
}

# /user resource
resource "aws_api_gateway_resource" "user" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  parent_id   = aws_api_gateway_rest_api.user_api.root_resource_id
  path_part   = "user"
}

# /meeting resource
resource "aws_api_gateway_resource" "meeting" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  parent_id   = aws_api_gateway_rest_api.user_api.root_resource_id
  path_part   = "meeting"
}

# GET method on /user
resource "aws_api_gateway_method" "get_user" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.header.Authorization" = false
  }
}

# GET method on /meeting
resource "aws_api_gateway_method" "get_meeting" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.meeting.id
  http_method   = "GET"
  authorization = "NONE"

  request_parameters = {
    "method.request.header.Authorization" = false
  }
}

# POST method on /meeting
resource "aws_api_gateway_method" "post_meeting" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.meeting.id
  http_method   = "POST"
  authorization = "NONE"

  request_parameters = {
    "method.request.header.Authorization" = false
  }
}

# PUT method on /user (authenticated)
resource "aws_api_gateway_method" "put_user" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "PUT"
  authorization = "NONE"

  request_parameters = {
    "method.request.header.Authorization" = false
  }
}

# PUT method on /meeting (authenticated)
resource "aws_api_gateway_method" "put_meeting" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.meeting.id
  http_method   = "PUT"
  authorization = "NONE"

  request_parameters = {
    "method.request.header.Authorization" = false
  }
}

# DELETE method on /meeting (authenticated)
resource "aws_api_gateway_method" "delete_meeting" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.meeting.id
  http_method   = "DELETE"
  authorization = "NONE"

  request_parameters = {
    "method.request.header.Authorization" = false
  }
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

# API Gateway Integration for GET method
resource "aws_api_gateway_integration" "get_meeting_integration" {
  rest_api_id             = aws_api_gateway_rest_api.user_api.id
  resource_id             = aws_api_gateway_resource.meeting.id
  http_method             = aws_api_gateway_method.get_meeting.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.meeting_lambda.invoke_arn
}

# API Gateway Integration for POST method
resource "aws_api_gateway_integration" "post_meeting_integration" {
  rest_api_id             = aws_api_gateway_rest_api.user_api.id
  resource_id             = aws_api_gateway_resource.meeting.id
  http_method             = aws_api_gateway_method.post_meeting.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.meeting_lambda.invoke_arn
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

# API Gateway Integration for PUT method
resource "aws_api_gateway_integration" "put_meeting_integration" {
  rest_api_id             = aws_api_gateway_rest_api.user_api.id
  resource_id             = aws_api_gateway_resource.meeting.id
  http_method             = aws_api_gateway_method.put_meeting.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.meeting_lambda.invoke_arn
}

# API Gateway Integration for DELETE method
resource "aws_api_gateway_integration" "delete_meeting_integration" {
  rest_api_id             = aws_api_gateway_rest_api.user_api.id
  resource_id             = aws_api_gateway_resource.meeting.id
  http_method             = aws_api_gateway_method.delete_meeting.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.meeting_lambda.invoke_arn
}

resource "aws_api_gateway_method" "options_user" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.user.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_method" "options_meeting" {
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  resource_id   = aws_api_gateway_resource.meeting.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "options_user_integration" {
  rest_api_id          = aws_api_gateway_rest_api.user_api.id
  resource_id          = aws_api_gateway_resource.user.id
  http_method          = aws_api_gateway_method.options_user.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = jsonencode(
      {
        statusCode = 200
      }
    )
  }

  depends_on = [aws_api_gateway_method.options_user]
}

resource "aws_api_gateway_integration" "options_meeting_integration" {
  rest_api_id          = aws_api_gateway_rest_api.user_api.id
  resource_id          = aws_api_gateway_resource.meeting.id
  http_method          = aws_api_gateway_method.options_meeting.http_method
  type                 = "MOCK"
  passthrough_behavior = "WHEN_NO_MATCH"
  request_templates = {
    "application/json" = jsonencode(
      {
        statusCode = 200
      }
    )
  }

  depends_on = [aws_api_gateway_method.options_meeting]
}


resource "aws_api_gateway_method_response" "options_user_response" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user.id
  http_method = aws_api_gateway_method.options_user.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true
    "method.response.header.Access-Control-Allow-Methods"     = true
    "method.response.header.Access-Control-Allow-Origin"      = true
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
}

resource "aws_api_gateway_method_response" "options_meeting_response" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.meeting.id
  http_method = aws_api_gateway_method.options_meeting.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = true
    "method.response.header.Access-Control-Allow-Methods"     = true
    "method.response.header.Access-Control-Allow-Origin"      = true
    "method.response.header.Access-Control-Allow-Credentials" = true
  }
}

resource "aws_api_gateway_integration_response" "options_user_integration_response" {
  depends_on = [aws_api_gateway_integration.options_user_integration]

  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.user.id
  http_method = aws_api_gateway_method.options_user.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'*'"
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,PUT,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"      = "'*'"
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
}

resource "aws_api_gateway_integration_response" "options_meeting_integration_response" {
  depends_on = [aws_api_gateway_integration.options_meeting_integration]

  rest_api_id = aws_api_gateway_rest_api.user_api.id
  resource_id = aws_api_gateway_resource.meeting.id
  http_method = aws_api_gateway_method.options_meeting.http_method
  status_code = "200"

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers"     = "'*'"
    "method.response.header.Access-Control-Allow-Methods"     = "'GET,PUT,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"      = "'*'"
    "method.response.header.Access-Control-Allow-Credentials" = "'true'"
  }
}


# Permission to allow API Gateway to invoke Lambda
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_profile_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_api.execution_arn}/*/*"
}

# Permission to allow API Gateway to invoke Lambda
resource "aws_lambda_permission" "allow_api_gateway_meeting" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.meeting_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_api.execution_arn}/*/*"
}

# IAM Role for API Gateway to write logs to CloudWatch
resource "aws_iam_role" "api_gateway_logs_role" {
  name = "APIGatewayCloudWatchLogsRole"

  assume_role_policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "apigateway.amazonaws.com"
        },
        "Action" : "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_policy" "api_gateway_logs_policy" {
  name = "APIGatewayCloudWatchLogsPolicy"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:DescribeLogGroups",
          "logs:DescribeLogStreams",
          "logs:PutLogEvents",
          "logs:GetLogEvents",
          "logs:FilterLogEvents"
        ],
        "Resource" : "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "attach_api_gateway_logs_policy" {
  role       = aws_iam_role.api_gateway_logs_role.name
  policy_arn = aws_iam_policy.api_gateway_logs_policy.arn
}

resource "aws_cloudwatch_log_group" "api_gateway_logs" {
  name              = "/aws/api_gateway/${aws_api_gateway_rest_api.user_api.name}"
  retention_in_days = 7
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "user_api_deployment" {
  depends_on = [
    aws_api_gateway_integration.get_user_integration,
    aws_api_gateway_integration.put_user_integration,
    aws_api_gateway_integration.options_user_integration,
    aws_api_gateway_integration.get_meeting_integration,
    aws_api_gateway_integration.post_meeting_integration,
    aws_api_gateway_integration.put_meeting_integration,
    aws_api_gateway_integration.delete_meeting_integration,
    aws_api_gateway_integration.options_meeting_integration
  ]
  rest_api_id = aws_api_gateway_rest_api.user_api.id
}

# API Gateway Stage with Logging and Method Settings
# Updated aws_api_gateway_stage without method_settings and cloudwatch_logs_role_arn
resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.user_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.user_api.id
  stage_name    = "prod"

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway_logs.arn
    format = jsonencode({
      requestId         = "$context.requestId",
      extendedRequestId = "$context.extendedRequestId",
      httpMethod        = "$context.httpMethod",
      resourcePath      = "$context.resourcePath",
      status            = "$context.status",
      protocol          = "$context.protocol",
      responseLength    = "$context.responseLength"
    })
  }

  lifecycle {
    create_before_destroy = true
  }

  depends_on = [
    aws_api_gateway_deployment.user_api_deployment
  ]
}

resource "aws_api_gateway_method_settings" "prod" {
  rest_api_id = aws_api_gateway_rest_api.user_api.id
  stage_name  = aws_api_gateway_stage.prod.stage_name

  method_path = "*/*" # Applies settings to all methods and resources

  settings {
    metrics_enabled        = true
    logging_level          = "INFO" # Options: OFF, ERROR, or INFO
    data_trace_enabled     = true
    throttling_burst_limit = -1 # Optional: Adjust as needed
    throttling_rate_limit  = -1 # Optional: Adjust as needed
  }
}
