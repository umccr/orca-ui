
import os
import boto3

def handler(event, context):
    pipeline_name = os.environ['CODEPIPELINE_NAME']
    client = boto3.client('codepipeline')
    

    try:
        response = client.start_pipeline_execution(name=pipeline_name)

        return {
            'statusCode': 200,
            'body': f"Pipeline execution started for {pipeline_name}. Execution ID: {response['pipelineExecutionId']}"
        }
    except Exception as e:
        # Log the error and return a failure response
        print("Error:")
        print(e)
        return {
            'statusCode': 500,
            'body': f"Failed to trigger CodeBuild project. {e}"
        }
