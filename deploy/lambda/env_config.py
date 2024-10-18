
import os
import boto3
import json

# ssm = boto3.client('ssm')
s3 = boto3.client('s3')
cloudfront = boto3.client('cloudfront')

# def get_ssm_parameter(name):
#     try: 
#         response = ssm.get_parameter(Name=name, WithDecryption=True)
#         return response['Parameter']['Value']
#     except ssm.exceptions.ParameterNotFound:
#         print(f"SSM Parameter not found: {name}")
#         return None
#     except Exception as e:
#         print(f"Error fetching SSM parameter {name}: {str(e)}")
#         return None

def handler(event, context):
    
    bucket_name = os.environ['BUCKET_NAME']
    cloudfront_distribution_id = os.environ['CLOUDFRONT_DISTRIBUTION_ID']
    
    # List of SSM parameters to fetch
    env_vars = {
        'VITE_COG_APP_CLIENT_ID': os.environ['VITE_COG_APP_CLIENT_ID'],
        'VITE_OAUTH_REDIRECT_IN': os.environ['VITE_OAUTH_REDIRECT_IN'],
        'VITE_OAUTH_REDIRECT_OUT': os.environ['VITE_OAUTH_REDIRECT_OUT'],
        'VITE_COG_USER_POOL_ID': os.environ['VITE_COG_USER_POOL_ID'],
        'VITE_COG_IDENTITY_POOL_ID': os.environ['VITE_COG_IDENTITY_POOL_ID'],
        'VITE_OAUTH_DOMAIN': os.environ['VITE_OAUTH_DOMAIN'],
        'VITE_UNSPLASH_CLIENT_ID': os.environ['VITE_UNSPLASH_CLIENT_ID'],
        
        'VITE_REGION': os.environ['VITE_REGION'],
        'VITE_METADATA_URL': os.environ['VITE_METADATA_URL'],
        'VITE_WORKFLOW_URL': os.environ['VITE_WORKFLOW_URL'],
        'VITE_SEQUENCE_RUN_URL': os.environ['VITE_SEQUENCE_RUN_URL'],
        'VITE_FILE_URL': os.environ['VITE_FILE_URL'],
    }
    
        
    env_js_content = f"window.config = {json.dumps(env_vars, indent=2)}"
    
    
    try:
        s3.put_object(Bucket=bucket_name, Key='env.js', Body=env_js_content, ContentType='text/javascript')
        
        # invalidate cloudfront distribution for all files (clear cache)
        cloudfront.create_invalidation(
            DistributionId=cloudfront_distribution_id,
            InvalidationBatch={
                'Paths': {
                    'Quantity': 1,
                    'Items': ['/*']
                },
                'CallerReference': str(context.aws_request_id)
            }
        )

        return {
            'statusCode': 200,
            'body': f" env.js uploaded to {bucket_name}, and CloudFront cache invalidated for {cloudfront_distribution_id}"
        }
    except Exception as e:
        # Log the error and return a failure response
        print("Error:")
        print(e)
        return {
            'statusCode': 500,
            'body': f"Failed to upload env.js to {bucket_name}. {e}"
        }
