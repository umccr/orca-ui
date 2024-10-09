
import os
import boto3

def handler(event, context):
    CODEBUILD_PROJECT_NAME = os.environ['CODEBUILD_PROJECT_NAME']
    client = boto3.client('codebuild')
    

    try:
        response = client.start_build(projectName=CODEBUILD_PROJECT_NAME)

        return {
            'statusCode': 200,
            'body': f"Build execution started for {CODEBUILD_PROJECT_NAME}. Execution ID: {response['buildExecutionId']}"
        }
    except Exception as e:
        # Log the error and return a failure response
        print("Error:")
        print(e)
        return {
            'statusCode': 500,
            'body': f"Failed to trigger CodeBuild project. {e}"
        }
