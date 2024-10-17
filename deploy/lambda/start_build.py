
import os
import boto3
import json

def handler(event, context):
    ssm = boto3.client('ssm')
    s3 = boto3.client('s3')
    cloudfront = boto3.client('cloudfront')
    
    bucket_name = os.environ['BUCKET_NAME']
    cloudfront_distribution_id = os.environ['CLOUDFRONT_DISTRIBUTION_ID']
    # List of SSM parameters to fetch
    
    
    env_params = [
        'VITE_METADATA_URL',
        'VITE_WORKFLOW_URL',
        'VITE_SEQUENCE_RUN_URL',
        'VITE_FILE_URL',
        
        'VITE_REGION',
        'VITE_COG_APP_CLIENT_ID',
        'VITE_OAUTH_REDIRECT_IN',
        'VITE_OAUTH_REDIRECT_OUT',
        'VITE_COG_USER_POOL_ID',
        'VITE_COG_IDENTITY_POOL_ID',
        'VITE_OAUTH_DOMAIN',
        'VITE_UNSPLASH_CLIENT_ID',
    ]
    
    env_variables = {}
    for param in env_params:
        env_variables[param] = os.environ[param]
        
    env_js_content = f"window.config = {json.dumps(env_variables, indent=2)}"
    
    
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
