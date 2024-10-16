
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
    ssm_params = [
        '/orcaui/cog_app_client_id_stage',
        '/orcaui/oauth_redirect_in_stage',
        '/orcaui/oauth_redirect_out_stage',
        '/data_portal/client/cog_user_pool_id',
        '/data_portal/client/cog_identity_pool_id',
        '/data_portal/client/oauth_domain',
        '/data_portal/unsplash/client_id',
    ]
    
    env_variables = {}
    
    # Fetch parameters from SSM
    params = {}
    for param in ssm_params:
        response = ssm.get_parameter(Name=param)
        env_variables[param] = response['Parameter']['Value']
        
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
            'body': f" env.js uploaded to {bucket_name}"
        }
    except Exception as e:
        # Log the error and return a failure response
        print("Error:")
        print(e)
        return {
            'statusCode': 500,
            'body': f"Failed to upload env.js to {bucket_name}. {e}"
        }
